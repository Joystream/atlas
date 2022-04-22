import { useMemo } from 'react'

import { createAllNotificationArray, useRawActivities } from '@/api/hooks'
import { BasicMembershipFieldsFragment, StorageDataObjectFieldsFragment } from '@/api/queries'

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
      bidAmount: number
      from: BasicMembershipFieldsFragment
    } & NftActivitiesRecord)
  | ({
      type: 'Purchase'
      from: BasicMembershipFieldsFragment | null
      price: number
      to: BasicMembershipFieldsFragment | null
    } & NftActivitiesRecord)
  | ({
      type: 'Withdrawal'
      from: BasicMembershipFieldsFragment
    } & NftActivitiesRecord)
  | ({
      type: 'Sale'
      from: BasicMembershipFieldsFragment | null
      price: number
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
      price?: number
    } & NftActivitiesRecord)
  | ({
      type: 'Mint'
      from: BasicMembershipFieldsFragment | null
    } & NftActivitiesRecord)
  | ({
      type: 'Price change'
      from: BasicMembershipFieldsFragment | null
      price: number
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
    case 'AuctionBidMadeEvent':
      return {
        ...commonFields,
        type: 'Bid',
        bidAmount: Number(event.bidAmount),
        from: event.member,
      }
    case 'NftBoughtEvent':
    case 'BidMadeCompletingAuctionEvent':
      if (memberId === event.ownerMember?.id) {
        return {
          ...commonFields,
          type: 'Sale',
          price: Number(event.price),
          from: event.ownerMember || null,
          to: event.member,
        }
      } else {
        return {
          ...commonFields,
          type: 'Purchase',
          price: Number(event.price),
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
        price: event.__typename === 'NftSellOrderMadeEvent' ? Number(event.price) : undefined,
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
        price: Number(event.newPrice),
      }
    case 'OpenAuctionBidAcceptedEvent':
      if (memberId === event.ownerMember?.id) {
        return {
          ...commonFields,
          type: 'Sale',
          price: Number(event.winningBid?.amount),
          to: event.winningBid?.bidder || null,
          from: event.ownerMember || null,
        }
      } else {
        return {
          ...commonFields,
          type: 'Purchase',
          price: Number(event.winningBid?.amount),
          from: event.winningBid?.bidder || null,
          to: event.ownerMember || null,
        }
      }

    default:
      return null
  }
}

export const useActivities = (memberId?: string) => {
  const { activities: rawActivities, rawData, error, loading } = useRawActivities(memberId)
  const parsedActivities = rawActivities && rawActivities.map((a) => parseActivities(a, memberId))
  const activities = parsedActivities ? parsedActivities.filter((a): a is ActivitiesRecord => !!a) : undefined

  const totalCounts = useMemo(() => {
    const purchaseNftBought = rawData?.purchaseNftBoughtEventsConnection.totalCount || 0
    const auctionBidMade = rawData?.auctionBidMadeEventsConnection.totalCount || 0
    const purchaseBidMadeCompletingAuction = rawData?.purchaseBidMadeCompletingAuctionEventsConnection.totalCount || 0
    const purchaseOpenAuctionBidAccepted = rawData?.purchaseOpenAuctionBidAcceptedEventsConnection.totalCount || 0
    const saleNftBought = rawData?.saleNftBoughtEventsConnection.totalCount || 0
    const saleBidMadeCompletingAuction = rawData?.saleBidMadeCompletingAuctionEventsConnection.totalCount || 0
    const saleOpenAuctionBidAccepted = rawData?.saleOpenAuctionBidAcceptedEventsConnection.totalCount || 0
    const nftIssued = rawData?.nftIssuedEventsConnection.totalCount || 0

    return rawData
      ? {
          nftsBoughts: purchaseNftBought + purchaseBidMadeCompletingAuction + purchaseOpenAuctionBidAccepted,
          nftsSold: saleNftBought + saleBidMadeCompletingAuction + saleOpenAuctionBidAccepted,
          nftsIssued: nftIssued,
          nftsBidded: auctionBidMade,
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
