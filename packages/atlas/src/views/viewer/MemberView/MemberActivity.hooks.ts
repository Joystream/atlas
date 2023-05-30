import { QueryHookOptions } from '@apollo/client'
import BN from 'bn.js'
import { useMemo } from 'react'

import { useActivitiesCount, useRawActivities } from '@/api/hooks/notifications'
import { NftActivityOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import {
  BasicMembershipFieldsFragment,
  BasicNftOwnerFieldsFragment,
  BasicVideoActivityFieldsFragment,
} from '@/api/queries/__generated__/fragments.generated'
import {
  GetNftActivitiesQuery,
  GetNftActivitiesQueryVariables,
} from '@/api/queries/__generated__/notifications.generated'
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

const getVideoDataFromEvent = (
  nftActivity: GetNftActivitiesQuery['nftActivitiesConnection']['edges'][number]['node']
) => {
  switch (nftActivity.event.data.__typename) {
    case 'AuctionBidMadeEventData':
    case 'AuctionBidCanceledEventData':
      return nftActivity.event.data.bid.auction.nft.video
    case 'EnglishAuctionSettledEventData':
    case 'BidMadeCompletingAuctionEventData':
    case 'OpenAuctionBidAcceptedEventData':
      return nftActivity.event.data.winningBid.auction.nft.video
    case 'NftBoughtEventData':
    case 'NftSellOrderMadeEventData':
    case 'BuyNowCanceledEventData':
    case 'BuyNowPriceUpdatedEventData':
    case 'NftIssuedEventData':
      return nftActivity.event.data.nft.video
    case 'EnglishAuctionStartedEventData':
    case 'OpenAuctionStartedEventData':
    case 'AuctionCanceledEventData':
      return nftActivity.event.data.auction.nft.video

    default:
      return undefined
  }
}

const parseActivities = (
  { node: nftActivity }: GetNftActivitiesQuery['nftActivitiesConnection']['edges'][number],
  memberId?: string
): ActivitiesRecord | null => {
  const commonFields: NftActivitiesRecord = {
    id: nftActivity.event.id,
    date: convertDateFormat(nftActivity.event.timestamp),
    block: nftActivity.event.inBlock,
    video: getVideoDataFromEvent(nftActivity),
  }
  switch (nftActivity.event.data.__typename) {
    case 'EnglishAuctionSettledEventData':
      if (memberId === nftActivity.event.data.winningBid.bidder?.id) {
        return {
          type: 'Purchase',
          ...commonFields,
          price: new BN(nftActivity.event.data.winningBid.amount),
          from: nftActivity.event.data.previousNftOwner || null,
          to: nftActivity.event.data.winningBid.bidder || null,
        }
      } else {
        return {
          ...commonFields,
          type: 'Sale',
          price: new BN(nftActivity.event.data.winningBid.amount),
          from: nftActivity.event.data.previousNftOwner || null,
          to: nftActivity.event.data.winningBid.bidder || null,
        }
      }
    case 'AuctionBidMadeEventData':
      return {
        ...commonFields,
        type: 'Bid',
        bidAmount: new BN(nftActivity.event.data.bid.amount),
        from: nftActivity.event.data.bid.bidder,
      }
    case 'NftBoughtEventData': {
      const previousNftOwner =
        nftActivity.event.data.previousNftOwner.__typename === 'NftOwnerChannel'
          ? nftActivity.event.data.previousNftOwner?.channel?.ownerMember
          : nftActivity.event.data.previousNftOwner.member
      if (memberId === previousNftOwner?.id) {
        return {
          ...commonFields,
          type: 'Sale',
          price: new BN(nftActivity.event.data.price),
          from: nftActivity.event.data.previousNftOwner,
          to: nftActivity.event.data.buyer,
        }
      } else {
        return {
          ...commonFields,
          type: 'Purchase',
          price: new BN(nftActivity.event.data.price),
          from: nftActivity.event.data.previousNftOwner,
          to: nftActivity.event.data.buyer,
        }
      }
    }
    case 'BidMadeCompletingAuctionEventData': {
      const previousOwnerMemberId =
        nftActivity.event.data.previousNftOwner.__typename === 'NftOwnerChannel'
          ? nftActivity.event.data.previousNftOwner?.channel?.ownerMember?.id
          : nftActivity.event.data.previousNftOwner.member.id

      if (memberId === previousOwnerMemberId) {
        return {
          ...commonFields,
          type: 'Sale',
          price: new BN(nftActivity.event.data.winningBid.amount),
          from: nftActivity.event.data.previousNftOwner || null,
          to: nftActivity.event.data.winningBid.bidder,
        }
      } else {
        return {
          ...commonFields,
          type: 'Purchase',
          price: new BN(nftActivity.event.data.winningBid.amount),
          from: nftActivity.event.data.previousNftOwner,
          to: nftActivity.event.data.winningBid.bidder || null,
        }
      }
    }
    case 'EnglishAuctionStartedEventData':
    case 'OpenAuctionStartedEventData':
    case 'NftSellOrderMadeEventData':
      return {
        ...commonFields,
        type: 'Listing',
        typeName: nftActivity.event.data.__typename,
        from: nftActivity.event.data.nftOwner || null,
        price:
          nftActivity.event.data.__typename === 'NftSellOrderMadeEventData'
            ? new BN(nftActivity.event.data.price)
            : undefined,
      }
    case 'AuctionCanceledEventData':
    case 'BuyNowCanceledEventData':
      return {
        ...commonFields,
        type: 'Removal',
        from: nftActivity.event.data.nftOwner || null,
      }
    case 'NftIssuedEventData':
      return {
        ...commonFields,
        type: 'Mint',
        from: nftActivity.event.data.nftOwner || null,
      }
    case 'AuctionBidCanceledEventData':
      return {
        ...commonFields,
        type: 'Withdrawal',
        from: nftActivity.event.data.member,
      }
    case 'BuyNowPriceUpdatedEventData':
      return {
        ...commonFields,
        type: 'Price change',
        from: nftActivity.event.data.nftOwner || null,
        price: new BN(nftActivity.event.data.newPrice),
      }
    case 'OpenAuctionBidAcceptedEventData':
      if (memberId !== nftActivity.event.data.winningBid.bidder?.id) {
        return {
          ...commonFields,
          type: 'Sale',
          price: new BN(nftActivity.event.data.winningBid?.amount ?? 0),
          from: nftActivity.event.data.previousNftOwner || null,
          to: nftActivity.event.data.winningBid?.bidder || null,
        }
      } else {
        return {
          ...commonFields,
          type: 'Purchase',
          price: new BN(nftActivity.event.data.winningBid?.amount ?? 0),
          from: nftActivity.event.data.previousNftOwner || null,
          to: nftActivity.event.data.winningBid.bidder || null,
        }
      }
    default:
      return null
  }
}

export const useActivities = (
  memberId?: string,
  sort?: NftActivityOrderByInput,
  opts?: QueryHookOptions<GetNftActivitiesQuery, GetNftActivitiesQueryVariables>
) => {
  const { activities: rawActivities, ...rest } = useRawActivities(memberId, sort, opts)

  const { nftsBiddedTotalCount, nftsBoughtTotalCount, nftsIssuedTotalCount, nftsSoldTotalCount } =
    useActivitiesCount(memberId)
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
    ...rest,
    activities,
    activitiesTotalCounts: totalCounts,
  }
}
