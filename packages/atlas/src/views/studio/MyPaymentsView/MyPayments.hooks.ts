import BN from 'bn.js'
import { Remote } from 'comlink'
import { useEffect, useState } from 'react'

import {
  GetChannelPaymentEventsQuery,
  GetFullChannelsQuery,
  useGetChannelPaymentEventsQuery,
} from '@/api/queries/__generated__/channels.generated'
import { PaymentHistory } from '@/components/TablePaymentsHistory'
import { JoystreamLib } from '@/joystream-lib/lib'
import { useJoystream } from '@/providers/joystream/joystream.hooks'

export const useChannelPaymentsHistory = (channel?: GetFullChannelsQuery['channels'][number]) => {
  const { joystream } = useJoystream()
  const [paymentData, setPaymentData] = useState<PaymentHistory[]>([])
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
        ]).then((result) => {
          setPaymentData(result.sort((a, b) => b.block - a.block))
        })
      }
    }

    init()
  }, [!joystream, !data, channel?.rewardAccount])

  return {
    rawData: data,
    paymentData,
    ...rest,
  }
}

type CommonEvent = Pick<
  GetChannelPaymentEventsQuery['channelRewardClaimedEvents'][number],
  'createdAt' | 'inBlock' | 'amount'
>

const mapEventToPaymentHistoryFactory =
  (joystream: Remote<JoystreamLib>, address: string) =>
  async <T extends CommonEvent>(event: T, type: PaymentHistory['type']): Promise<PaymentHistory> => {
    const channelBalance = await joystream.getAccountBalanceAtBlock(event.inBlock, address)
    const { inBlock, amount, createdAt } = event
    return {
      type,
      block: inBlock + 1,
      amount: new BN(amount),
      date: new Date(createdAt),
      channelBalance: new BN(channelBalance),
    }
  }
