// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useCallback, useEffect, useState } from 'react'

import { GetFullChannelsQuery, useGetChannelPaymentEventsQuery } from '@/api/queries/__generated__/channels.generated'
import { PaymentHistory } from '@/components/TablePaymentsHistory'
import { useJoystream } from '@/providers/joystream/joystream.hooks'

import { mapEventToPaymentHistoryFactory } from './PaymentTransactions.utils'

//! WARNING todo needs to be rewritten with orion v2
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

  const fetchPaymentsData = useCallback(() => {
    if (joystream && data && channel) {
      setLoading(true)
      const mapEventToPaymentHistory = mapEventToPaymentHistoryFactory(joystream, channel.rewardAccount)
      const rewardPromises = data.channelRewardClaimedEvents.map((event) =>
        mapEventToPaymentHistory(event, 'claimed-reward')
      )
      const ntfBoughtPromises = data.nftBoughtEvents.map((event) =>
        mapEventToPaymentHistory({ ...event, amount: event.price }, 'nft-sale')
      )
      const withdrawalPromises = data?.channelFundsWithdrawnEvents.map((event) =>
        mapEventToPaymentHistory(event, 'withdrawal')
      )
      const openAuctionAcceptedPromises = data?.openAuctionBidAcceptedEvents.map((event) =>
        mapEventToPaymentHistory({ ...event, amount: event.winningBid?.amount ?? '0' }, 'nft-sale')
      )
      const auctionCompletingBidPromises = data?.bidMadeCompletingAuctionEvents.map((event) =>
        mapEventToPaymentHistory({ ...event, amount: event.price }, 'nft-sale')
      )
      const auctionSettledPromises = data?.englishAuctionSettledEvents.map((event) =>
        mapEventToPaymentHistory({ ...event, amount: event.winningBid.amount ?? '0' }, 'nft-sale')
      )

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
  }, [joystream, data, channel])

  useEffect(() => {
    fetchPaymentsData()
  }, [joystream, data, channel, fetchPaymentsData])

  return {
    ...rest,
    rawData: data,
    paymentData,
    loading: rest.loading || loading,
    fetchPaymentsData,
  }
}
