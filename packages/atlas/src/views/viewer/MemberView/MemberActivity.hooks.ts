import BN from 'bn.js'
import { useMemo } from 'react'

import { useRawActivities } from '@/api/hooks/notifications'
import { EventOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import {
  BasicMembershipFieldsFragment,
  BasicNftOwnerFieldsFragment,
  BasicVideoActivityFieldsFragment,
} from '@/api/queries/__generated__/fragments.generated'
import { GetNftActivitiesQuery } from '@/api/queries/__generated__/notifications.generated'
import { convertDateFormat } from '@/utils/time'

export type NftActivitiesRecord = {
  id?: string
  date?: Date
  block?: number
  video?: BasicVideoActivityFieldsFragment
}

export type ActivitiesRecord =
  | ({
      type: 'Bid'
      bidAmount: BN
      from: BasicMembershipFieldsFragment
    } & NftActivitiesRecord)
  | ({
      type: 'Purchase'
      from: BasicNftOwnerFieldsFragment | null
      price: BN
      to: BasicMembershipFieldsFragment | null
    } & NftActivitiesRecord)
  | ({
      type: 'Withdrawal'
      from: BasicMembershipFieldsFragment
    } & NftActivitiesRecord)
  | ({
      type: 'Sale'
      from: BasicNftOwnerFieldsFragment | null
      price: BN
      to: BasicMembershipFieldsFragment | null
    } & NftActivitiesRecord)
  | ({
      type: 'Removal'
      from: BasicNftOwnerFieldsFragment | null
    } & NftActivitiesRecord)
  | ({
      type: 'Transfer'
      from: BasicNftOwnerFieldsFragment
    } & NftActivitiesRecord)
  | ({
      type: 'Listing'
      typeName: 'EnglishAuctionStartedEventData' | 'OpenAuctionStartedEventData' | 'NftSellOrderMadeEventData'
      from: BasicNftOwnerFieldsFragment | null
      price?: BN
    } & NftActivitiesRecord)
  | ({
      type: 'Mint'
      from: BasicNftOwnerFieldsFragment | null
    } & NftActivitiesRecord)
  | ({
      type: 'Price change'
      from: BasicNftOwnerFieldsFragment | null
      price: BN
    } & NftActivitiesRecord)

const getVideoDataFromEvent = (event: GetNftActivitiesQuery['events'][number]) => {
  switch (event.data.__typename) {
    case 'AuctionBidMadeEventData':
    case 'AuctionBidCanceledEventData':
      return event.data.bid.auction.nft.video
    case 'EnglishAuctionSettledEventData':
    case 'BidMadeCompletingAuctionEventData':
    case 'OpenAuctionBidAcceptedEventData':
      return event.data.winningBid.auction.nft.video
    case 'NftBoughtEventData':
    case 'NftSellOrderMadeEventData':
    case 'BuyNowCanceledEventData':
    case 'BuyNowPriceUpdatedEventData':
    case 'NftIssuedEventData':
      return event.data.nft.video
    case 'EnglishAuctionStartedEventData':
    case 'OpenAuctionStartedEventData':
    case 'AuctionCanceledEventData':
      return event.data.auction.nft.video

    default:
      return undefined
  }
}

const parseActivities = (
  event: GetNftActivitiesQuery['events'][number],
  memberId?: string
): ActivitiesRecord | null => {
  const commonFields: NftActivitiesRecord = {
    id: event.id,
    date: convertDateFormat(event.timestamp),
    block: event.inBlock,
    video: getVideoDataFromEvent(event),
  }
  switch (event.data.__typename) {
    case 'EnglishAuctionSettledEventData':
      if (memberId === event.data.winningBid.bidder?.id) {
        return {
          type: 'Purchase',
          ...commonFields,
          price: new BN(event.data.winningBid.amount),
          from: event.data.previousNftOwner || null,
          to: event.data.winningBid.bidder || null,
        }
      } else {
        return {
          ...commonFields,
          type: 'Sale',
          price: new BN(event.data.winningBid.amount),
          from: event.data.previousNftOwner || null,
          to: event.data.winningBid.bidder || null,
        }
      }
    case 'AuctionBidMadeEventData':
      return {
        ...commonFields,
        type: 'Bid',
        bidAmount: new BN(event.data.bid.amount),
        from: event.data.bid.bidder,
      }
    case 'NftBoughtEventData': {
      const previousNftOwner =
        event.data.previousNftOwner.__typename === 'NftOwnerChannel'
          ? event.data.previousNftOwner?.channel?.ownerMember
          : event.data.previousNftOwner.member
      if (memberId === previousNftOwner?.id) {
        return {
          ...commonFields,
          type: 'Sale',
          price: new BN(event.data.price),
          from: event.data.previousNftOwner,
          to: event.data.buyer,
        }
      } else {
        return {
          ...commonFields,
          type: 'Purchase',
          price: new BN(event.data.price),
          from: event.data.previousNftOwner,
          to: event.data.buyer,
        }
      }
    }
    case 'BidMadeCompletingAuctionEventData': {
      const previousOwnerMemberId =
        event.data.previousNftOwner.__typename === 'NftOwnerChannel'
          ? event.data.previousNftOwner?.channel?.ownerMember?.id
          : event.data.previousNftOwner.member.id

      if (memberId === previousOwnerMemberId) {
        return {
          ...commonFields,
          type: 'Sale',
          price: new BN(event.data.winningBid.amount),
          from: event.data.previousNftOwner || null,
          to: event.data.winningBid.bidder,
        }
      } else {
        return {
          ...commonFields,
          type: 'Purchase',
          price: new BN(event.data.winningBid.amount),
          from: event.data.previousNftOwner,
          to: event.data.winningBid.bidder || null,
        }
      }
    }
    case 'EnglishAuctionStartedEventData':
    case 'OpenAuctionStartedEventData':
    case 'NftSellOrderMadeEventData':
      return {
        ...commonFields,
        type: 'Listing',
        typeName: event.data.__typename,
        from: event.data.nftOwner || null,
        price: event.data.__typename === 'NftSellOrderMadeEventData' ? new BN(event.data.price) : undefined,
      }
    case 'AuctionCanceledEventData':
    case 'BuyNowCanceledEventData':
      return {
        ...commonFields,
        type: 'Removal',
        from: event.data.nftOwner || null,
      }
    case 'NftIssuedEventData':
      return {
        ...commonFields,
        type: 'Mint',
        from: event.data.nftOwner || null,
      }
    case 'AuctionBidCanceledEventData':
      return {
        ...commonFields,
        type: 'Withdrawal',
        from: event.data.member,
      }
    case 'BuyNowPriceUpdatedEventData':
      return {
        ...commonFields,
        type: 'Price change',
        from: event.data.nftOwner || null,
        price: new BN(event.data.newPrice),
      }
    case 'OpenAuctionBidAcceptedEventData':
      if (memberId !== event.data.winningBid.bidder?.id) {
        return {
          ...commonFields,
          type: 'Sale',
          price: new BN(event.data.winningBid?.amount ?? 0),
          from: event.data.previousNftOwner || null,
          to: event.data.winningBid?.bidder || null,
        }
      } else {
        return {
          ...commonFields,
          type: 'Purchase',
          price: new BN(event.data.winningBid?.amount ?? 0),
          from: event.data.previousNftOwner || null,
          to: event.data.winningBid.bidder || null,
        }
      }
    default:
      return null
  }
}

export const useActivities = (memberId?: string, sort?: EventOrderByInput) => {
  const {
    activities: rawActivities,
    nftsBiddedTotalCount,
    nftsIssuedTotalCount,
    nftsSoldTotalCount,
    nftsBoughtTotalCount,
    error,
    loading,
  } = useRawActivities(memberId, sort)
  const parsedActivities = rawActivities && rawActivities.map((a) => parseActivities(a, memberId))
  const activities = parsedActivities ? parsedActivities.filter((a): a is ActivitiesRecord => !!a) : undefined

  const totalCounts = useMemo(() => {
    return {
      nftsBoughts: nftsBoughtTotalCount,
      nftsSold: nftsSoldTotalCount,
      nftsIssued: nftsIssuedTotalCount,
      nftsBidded: nftsBiddedTotalCount,
    }
  }, [nftsBiddedTotalCount, nftsBoughtTotalCount, nftsIssuedTotalCount, nftsSoldTotalCount])

  return {
    activities,
    activitiesTotalCounts: totalCounts,
    error,
    loading,
  }
}
