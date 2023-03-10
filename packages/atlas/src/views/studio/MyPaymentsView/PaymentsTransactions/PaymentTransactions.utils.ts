import BN from 'bn.js'

import { GetChannelPaymentEventsQuery } from '@/api/queries/__generated__/channels.generated'
import { PaymentHistory } from '@/components/TablePaymentsHistory'

type EventData = GetChannelPaymentEventsQuery['events'][number]['data']

const getType = (eventData: EventData): PaymentHistory['type'] => {
  switch (eventData.__typename) {
    case 'NftBoughtEventData':
    case 'BidMadeCompletingAuctionEventData':
    case 'OpenAuctionBidAcceptedEventData':
    case 'EnglishAuctionSettledEventData':
      return 'nft-sale'
    case 'ChannelRewardClaimedEventData':
      return 'claimed-reward'
    case 'ChannelFundsWithdrawnEventData':
      return 'withdrawal'
    case 'ChannelPaymentMadeEventData':
      return 'direct-payment'
    default:
      throw Error('Unknown event')
  }
}

const getAmount = (eventData: EventData) => {
  switch (eventData.__typename) {
    case 'NftBoughtEventData':
      return eventData.price
    case 'BidMadeCompletingAuctionEventData':
    case 'OpenAuctionBidAcceptedEventData':
    case 'EnglishAuctionSettledEventData':
      return eventData.winningBid.amount
    case 'ChannelRewardClaimedEventData':
    case 'ChannelFundsWithdrawnEventData':
    case 'ChannelPaymentMadeEventData':
      return eventData.amount
    default:
      throw Error('Unknown event')
  }
}

const getSender = (eventData: EventData) => {
  switch (eventData.__typename) {
    case 'NftBoughtEventData':
      return eventData.buyer.controllerAccount
    case 'BidMadeCompletingAuctionEventData':
    case 'OpenAuctionBidAcceptedEventData':
    case 'EnglishAuctionSettledEventData':
      return eventData.winningBid.bidder.controllerAccount
    case 'ChannelRewardClaimedEventData':
      return ''
    case 'ChannelFundsWithdrawnEventData':
      return eventData.actor.__typename === 'ContentActorMember' ? eventData.actor.member.controllerAccount : 'council'
    case 'ChannelPaymentMadeEventData':
      return eventData.payer.controllerAccount
    default:
      throw Error('Unknown event')
  }
}

export const mapEventToPaymentHistory = (event: GetChannelPaymentEventsQuery['events'][number]): PaymentHistory => {
  const { inBlock, timestamp } = event
  return {
    type: getType(event.data),
    block: inBlock + 1,
    amount: new BN(getAmount(event.data)),
    date: new Date(timestamp),
    description: (event.data.__typename === 'ChannelPaymentMadeEventData' && event.data.rationale) || undefined,
    sender: getSender(event.data),
  }
}

export const aggregatePaymentHistory = (arg: PaymentHistory[]) =>
  arg.reduce(
    (prev, next) => {
      if (next.type === 'withdrawal') {
        prev.totalWithdrawn.iadd(next.amount)
        return prev
      }
      prev.totalEarned.iadd(next.amount)
      return prev
    },
    {
      totalEarned: new BN(0),
      totalWithdrawn: new BN(0),
    }
  )
