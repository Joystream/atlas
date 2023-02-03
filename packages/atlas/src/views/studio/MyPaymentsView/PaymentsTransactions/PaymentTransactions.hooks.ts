import { useEffect, useState } from 'react'

import { GetFullChannelsQuery, useGetChannelPaymentEventsQuery } from '@/api/queries/__generated__/channels.generated'
import { PaymentHistory } from '@/components/TablePaymentsHistory'

import { mapEventToPaymentHistory } from './PaymentTransactions.utils'

export const useChannelPaymentsHistory = (channel?: GetFullChannelsQuery['channels'][number]) => {
  const [paymentData, setPaymentData] = useState<PaymentHistory[]>([])

  const { data, ...rest } = useGetChannelPaymentEventsQuery({
    variables: {
      channelId: channel?.id ?? '-1',
      ownerMemberId: channel?.ownerMember?.id ?? '-1',
    },
    skip: !channel,
  })

  useEffect(() => {
    if (data) {
      const rewardClaimed = data.channelRewardClaimedEvents.map((event) =>
        mapEventToPaymentHistory(
          {
            ...event,
            sender: 'council',
          },
          'council-reward'
        )
      )
      const ntfBought = data.nftBoughtEvents.map((event) =>
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
      const withdrawalMade = data.channelFundsWithdrawnEvents.map((event) =>
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
      const openAuctionAccepted = data.openAuctionBidAcceptedEvents.map((event) =>
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
      const auctionCompletingBid = data.bidMadeCompletingAuctionEvents.map((event) =>
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
      const auctionSettled = data.englishAuctionSettledEvents.map((event) =>
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

      const directPayment = data.channelPaymentMadeEvents.map((event) =>
        mapEventToPaymentHistory(
          { ...event, sender: event.payer.controllerAccount, description: event.rationale ?? undefined },
          'direct-payment'
        )
      )

      const result = [
        ...directPayment,
        ...auctionCompletingBid,
        ...auctionSettled,
        ...openAuctionAccepted,
        ...ntfBought,
        ...rewardClaimed,
        ...withdrawalMade,
      ].sort((a, b) => b.block - a.block)
      setPaymentData(result)
    }
  }, [data])

  return {
    ...rest,
    rawData: data,
    paymentData,
    loading: rest.loading,
    fetchPaymentsData: rest.refetch,
  }
}
