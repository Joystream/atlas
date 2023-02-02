import { useCallback, useEffect, useState } from 'react'

import { GetFullChannelsQuery, useGetChannelPaymentEventsQuery } from '@/api/queries/__generated__/channels.generated'
import { PaymentHistory } from '@/components/TablePaymentsHistory'
import { useJoystream } from '@/providers/joystream/joystream.hooks'

import { mapEventToPaymentHistory } from './PaymentTransactions.utils'

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
      const rewardPromises = data.channelRewardClaimedEvents.map((event) =>
        mapEventToPaymentHistory(
          {
            ...event,
            sender: 'council',
          },
          'council-reward'
        )
      )
      const ntfBoughtPromises = data.nftBoughtEvents.map((event) =>
        mapEventToPaymentHistory(
          {
            ...event,
            amount: event.price,
            sender: event.member.controllerAccount,
            description: `Sold NFT: ${event.video.title}`,
          },
          'nft-sale'
        )
      )
      const withdrawalPromises = data?.channelFundsWithdrawnEvents.map((event) =>
        mapEventToPaymentHistory(
          {
            ...event,
            sender:
              event.actor.__typename === 'ContentActorMember'
                ? event.actor?.member?.controllerAccount ?? 'council'
                : 'council',
          },
          'withdrawal'
        )
      )
      const openAuctionAcceptedPromises = data?.openAuctionBidAcceptedEvents.map((event) =>
        mapEventToPaymentHistory(
          {
            ...event,
            amount: event.winningBid?.amount ?? '0',
            sender: event.winningBidder?.controllerAccount ?? 'council',
            description: `Sold NFT: ${event.video.title}`,
          },
          'nft-sale'
        )
      )
      const auctionCompletingBidPromises = data?.bidMadeCompletingAuctionEvents.map((event) =>
        mapEventToPaymentHistory(
          {
            ...event,
            amount: event.price,
            sender: event.member.controllerAccount,
            description: `Sold NFT: ${event.video.title}`,
          },
          'nft-sale'
        )
      )
      const auctionSettledPromises = data?.englishAuctionSettledEvents.map((event) =>
        mapEventToPaymentHistory(
          {
            ...event,
            amount: event.winningBid.amount ?? '0',
            sender: event.winner.controllerAccount,
            description: `Sold NFT: ${event.video.title}`,
          },
          'nft-sale'
        )
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
