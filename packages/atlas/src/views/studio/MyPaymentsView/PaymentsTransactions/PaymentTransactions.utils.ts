import BN from 'bn.js'

import { GetChannelPaymentEventsQuery } from '@/api/queries/__generated__/channels.generated'
import { PaymentHistory } from '@/components/TablePaymentsHistory'

type EventData = GetChannelPaymentEventsQuery['events'][number]['data'] & {
  nftPlatformFeePercentage: number
}

const getType = (eventData: EventData): PaymentHistory['type'] => {
  switch (eventData.__typename) {
    case 'NftBoughtEventData':
    case 'BidMadeCompletingAuctionEventData':
    case 'OpenAuctionBidAcceptedEventData':
    case 'EnglishAuctionSettledEventData':
      if (eventData.previousNftOwner.__typename !== 'NftOwnerChannel') {
        return 'nft-royalty'
      }
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

const getAmount = (eventData: EventData): BN => {
  switch (eventData.__typename) {
    case 'NftBoughtEventData': {
      if (eventData.previousNftOwner.__typename !== 'NftOwnerChannel') {
        return new BN(eventData.price)?.muln(eventData.nft.creatorRoyalty ? eventData.nft.creatorRoyalty : 0).divn(100)
      }
      return new BN(eventData.price).muln(100 - eventData.nftPlatformFeePercentage).divn(100)
    }
    case 'BidMadeCompletingAuctionEventData':
    case 'OpenAuctionBidAcceptedEventData':
    case 'EnglishAuctionSettledEventData': {
      if (eventData.previousNftOwner.__typename !== 'NftOwnerChannel') {
        return new BN(eventData.winningBid.amount)
          ?.muln(eventData.winningBid.nft.creatorRoyalty ? eventData.winningBid.nft.creatorRoyalty : 0)
          .divn(100)
      }
      return new BN(eventData.winningBid.amount).muln(100 - eventData.nftPlatformFeePercentage).divn(100)
    }
    case 'ChannelFundsWithdrawnEventData':
      return new BN(-eventData.amount)
    case 'ChannelRewardClaimedEventData':
    case 'ChannelPaymentMadeEventData':
      return new BN(eventData.amount)
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
      return 'council'
    case 'ChannelFundsWithdrawnEventData':
      return eventData.actor.__typename === 'ContentActorMember' ? eventData.actor.member.controllerAccount : 'council'
    case 'ChannelPaymentMadeEventData':
      return eventData.payer.controllerAccount
    default:
      throw Error('Unknown event')
  }
}

const getDescription = (eventData: EventData) => {
  switch (eventData.__typename) {
    case 'NftBoughtEventData': {
      if (eventData.previousNftOwner.__typename !== 'NftOwnerChannel') {
        return `Royalty from NFT: ${eventData.nft.video.title}`
      }
      return `Sold NFT: ${eventData.nft.video.title}`
    }
    case 'BidMadeCompletingAuctionEventData':
    case 'OpenAuctionBidAcceptedEventData':
    case 'EnglishAuctionSettledEventData': {
      if (eventData.previousNftOwner.__typename !== 'NftOwnerChannel') {
        return `Royalty from NFT: ${eventData.winningBid.nft.video.title}`
      }
      return `Sold NFT: ${eventData.winningBid.nft.video.title}`
    }
    case 'ChannelRewardClaimedEventData':
    case 'ChannelFundsWithdrawnEventData':
      return ''
    case 'ChannelPaymentMadeEventData':
      return eventData.rationale
    default:
      return undefined
  }
}

export const mapEventToPaymentHistory =
  (nftPlatformFeePercentage: number) =>
  (event: GetChannelPaymentEventsQuery['events'][number]): PaymentHistory => {
    const { inBlock, timestamp } = event
    const eventData = { ...event.data, nftPlatformFeePercentage }
    return {
      type: getType(eventData),
      block: inBlock,
      amount: getAmount(eventData),
      date: new Date(timestamp),
      description: getDescription(eventData) || '-',
      sender: getSender(eventData),
    }
  }

export const aggregatePaymentHistory = (arg: PaymentHistory[]) =>
  arg.reduce(
    (prev, next) => {
      if (next.type === 'withdrawal') {
        prev.totalWithdrawn.iadd(next.amount.abs())
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
