import { useEffect, useState } from 'react'

import { GetFullChannelsQuery, useGetChannelPaymentEventsQuery } from '@/api/queries/__generated__/channels.generated'
import { PaymentHistory } from '@/components/TablePaymentsHistory'
import { useJoystream } from '@/providers/joystream/joystream.hooks'

import { mapEventToPaymentHistoryFactory } from './PaymentTransactionsTab.utils'

export const useChannelPaymentsHistory = (channel?: GetFullChannelsQuery['channels'][number]) => {
  const { joystream } = useJoystream()
  const [paymentData, setPaymentData] = useState<PaymentHistory[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const { data, ...rest } = useGetChannelPaymentEventsQuery({
    variables: {
      channelId: channel?.id ?? '-1',
      ownerMemberId: channel?.ownerMember?.id ?? '-1',
    },
    skip: !channel,
  })

  useEffect(() => {
    const init = () => {
      if (joystream && data && channel) {
        setLoading(true)
        const mapEventToPaymentHistory = mapEventToPaymentHistoryFactory(joystream, channel.rewardAccount)
        const channelFilter = <T extends { video: { channelId: string } }>(event: T) =>
          event.video.channelId === channel.id

        const rewardPromises = data.channelRewardClaimedEvents.map((event) =>
          mapEventToPaymentHistory(event, 'claimed-reward')
        )
        const withdrawalPromises = data?.channelFundsWithdrawnEvents.map((event) =>
          mapEventToPaymentHistory(event, 'withdrawal')
        )

        const ntfBoughtPromises = data.nftBoughtEvents
          .filter(channelFilter)
          .map((event) => mapEventToPaymentHistory({ ...event, amount: event.price }, 'nft-sale'))
        const openAuctionAcceptedPromises = data?.openAuctionBidAcceptedEvents
          .filter(channelFilter)
          .map((event) => mapEventToPaymentHistory({ ...event, amount: event.winningBid?.amount ?? '0' }, 'nft-sale'))
        const auctionCompletingBidPromises = data?.bidMadeCompletingAuctionEvents
          .filter(channelFilter)
          .map((event) => mapEventToPaymentHistory({ ...event, amount: event.price }, 'nft-sale'))
        const auctionSettledPromises = data?.englishAuctionSettledEvents
          .filter(channelFilter)
          .map((event) => mapEventToPaymentHistory({ ...event, amount: event.winningBid.amount ?? '0' }, 'nft-sale'))

        Promise.all([
          ...rewardPromises,
          ...withdrawalPromises,
          ...ntfBoughtPromises,
          ...auctionSettledPromises,
          ...auctionCompletingBidPromises,
          ...openAuctionAcceptedPromises,
        ])
          .then((result) => {
            setPaymentData(result.sort((a, b) => b.block - a.block))
          })
          .finally(() => {
            setLoading(false)
          })
      }
    }

    init()
  }, [joystream, data, channel])

  return {
    ...rest,
    rawData: data,
    paymentData,
    loading: rest.loading || loading,
  }
}
