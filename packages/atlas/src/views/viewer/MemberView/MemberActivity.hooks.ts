import BN from 'bn.js'
import { useMemo } from 'react'

import { createAllNotificationArray, useRawActivities } from '@/api/hooks/notifications'
import {
  BasicMembershipFieldsFragment,
  StorageDataObjectFieldsFragment,
} from '@/api/queries/__generated__/fragments.generated'

export type NftActivitiesRecord = {
  id?: string
  date?: Date
  block?: number
  video?: {
    id: string
    title: string
    thumbnailPhoto: StorageDataObjectFieldsFragment | null
  }
}
export type ActivitiesRecord =
  | ({
      type: 'Bid'
      bidAmount: BN
      from: BasicMembershipFieldsFragment
    } & NftActivitiesRecord)
  | ({
      type: 'Purchase'
      from: BasicMembershipFieldsFragment | null
      price: BN
      to: BasicMembershipFieldsFragment | null
    } & NftActivitiesRecord)
  | ({
      type: 'Withdrawal'
      from: BasicMembershipFieldsFragment
    } & NftActivitiesRecord)
  | ({
      type: 'Sale'
      from: BasicMembershipFieldsFragment | null
      price: BN
      to: BasicMembershipFieldsFragment | null
    } & NftActivitiesRecord)
  | ({
      type: 'Removal'
      from: BasicMembershipFieldsFragment | null
    } & NftActivitiesRecord)
  | ({
      type: 'Transfer'
      from: BasicMembershipFieldsFragment
    } & NftActivitiesRecord)
  | ({
      type: 'Listing'
      typeName: 'EnglishAuctionStartedEvent' | 'OpenAuctionStartedEvent' | 'NftSellOrderMadeEvent'
      from: BasicMembershipFieldsFragment | null
      price?: BN
    } & NftActivitiesRecord)
  | ({
      type: 'Mint'
      from: BasicMembershipFieldsFragment | null
    } & NftActivitiesRecord)
  | ({
      type: 'Price change'
      from: BasicMembershipFieldsFragment | null
      price: BN
    } & NftActivitiesRecord)

const parseActivities = (
  event: ReturnType<typeof createAllNotificationArray>[number],
  memberId?: string
): ActivitiesRecord | null => {
  const commonFields: NftActivitiesRecord = {
    id: event.id,
    date: event.createdAt,
    block: event.inBlock,
    video: {
      id: event.video.id,
      title: event.video.title || '',
      thumbnailPhoto: event.video.thumbnailPhoto || null,
    },
  }
  switch (event.__typename) {
    case 'EnglishAuctionSettledEvent':
      if (memberId === event.ownerMember?.id) {
        return {
          type: 'Purchase',
          ...commonFields,
          price: new BN(event.winningBid.amount),
          to: event.winner || null,
          from: event.ownerMember || null,
        }
      } else {
        return {
          ...commonFields,
          type: 'Sale',
          price: new BN(event.winningBid.amount),
          from: event.winner || null,
          to: event.ownerMember || null,
        }
      }
    case 'AuctionBidMadeEvent':
      return {
        ...commonFields,
        type: 'Bid',
        bidAmount: new BN(event.bidAmount),
        from: event.member,
      }
    case 'NftBoughtEvent':
    case 'BidMadeCompletingAuctionEvent':
      if (memberId === event.ownerMember?.id) {
        return {
          ...commonFields,
          type: 'Sale',
          price: new BN(event.price),
          from: event.ownerMember || null,
          to: event.member,
        }
      } else {
        return {
          ...commonFields,
          type: 'Purchase',
          price: new BN(event.price),
          from: event.member,
          to: event.ownerMember || null,
        }
      }
    case 'EnglishAuctionStartedEvent':
    case 'OpenAuctionStartedEvent':
    case 'NftSellOrderMadeEvent':
      return {
        ...commonFields,
        type: 'Listing',
        typeName: event.__typename,
        from: event.ownerMember || null,
        price: event.__typename === 'NftSellOrderMadeEvent' ? new BN(event.price) : undefined,
      }
    case 'AuctionCanceledEvent':
    case 'BuyNowCanceledEvent':
      return {
        ...commonFields,
        type: 'Removal',
        from: event.ownerMember || null,
      }
    case 'NftIssuedEvent':
      return {
        ...commonFields,
        type: 'Mint',
        from: event.ownerMember || null,
      }
    case 'AuctionBidCanceledEvent':
      return {
        ...commonFields,
        type: 'Withdrawal',
        from: event.member,
      }
    case 'BuyNowPriceUpdatedEvent':
      return {
        ...commonFields,
        type: 'Price change',
        from: event.ownerMember || null,
        price: new BN(event.newPrice),
      }
    case 'OpenAuctionBidAcceptedEvent':
      if (memberId === event.ownerMember?.id) {
        return {
          ...commonFields,
          type: 'Sale',
          price: new BN(event.winningBid?.amount ?? 0),
          to: event.winningBid?.bidder || null,
          from: event.ownerMember || null,
        }
      } else {
        return {
          ...commonFields,
          type: 'Purchase',
          price: new BN(event.winningBid?.amount ?? 0),
          from: event.winningBid?.bidder || null,
          to: event.ownerMember || null,
        }
      }
    default:
      return null
  }
}

export const useActivities = (memberId?: string, sort?: 'createdAt_ASC' | 'createdAt_DESC') => {
  const { activities: rawActivities, rawData, error, loading } = useRawActivities(memberId, sort)
  const parsedActivities = rawActivities && rawActivities.map((a) => parseActivities(a, memberId))
  const activities = parsedActivities ? parsedActivities.filter((a): a is ActivitiesRecord => !!a) : undefined

  const totalCounts = useMemo(() => {
    const purchaseNftBoughtCount = rawData?.purchaseNftBoughtEventsConnection.totalCount || 0
    const auctionBidMadeCount = rawData?.auctionBidMadeEventsConnection.totalCount || 0
    const purchaseBidMadeCompletingAuctionCount =
      rawData?.purchaseBidMadeCompletingAuctionEventsConnection.totalCount || 0
    const purchaseOpenAuctionBidAcceptedCount = rawData?.purchaseOpenAuctionBidAcceptedEventsConnection.totalCount || 0
    const purchaseEnglishAuctionSettledCount = rawData?.purchaseEnglishAuctionSettledEventsConnection.totalCount || 0
    const saleNftBoughtCount = rawData?.saleNftBoughtEventsConnection.totalCount || 0
    const saleBidMadeCompletingAuctionCount = rawData?.saleBidMadeCompletingAuctionEventsConnection.totalCount || 0
    const saleEnglishAuctionSettledCount = rawData?.saleEnglishAuctionSettledEventsConnection.totalCount || 0
    const saleOpenAuctionBidAcceptedCount = rawData?.saleOpenAuctionBidAcceptedEventsConnection.totalCount || 0
    const nftIssuedCount = rawData?.nftIssuedEventsConnection.totalCount || 0

    return rawData
      ? {
          nftsBoughts:
            purchaseNftBoughtCount +
            purchaseBidMadeCompletingAuctionCount +
            purchaseOpenAuctionBidAcceptedCount +
            purchaseEnglishAuctionSettledCount,
          nftsSold:
            saleNftBoughtCount +
            saleBidMadeCompletingAuctionCount +
            saleOpenAuctionBidAcceptedCount +
            saleEnglishAuctionSettledCount,
          nftsIssued: nftIssuedCount,
          nftsBidded: auctionBidMadeCount,
        }
      : undefined
  }, [rawData])

  return {
    activities,
    activitiesTotalCounts: totalCounts,
    error,
    loading,
  }
}
