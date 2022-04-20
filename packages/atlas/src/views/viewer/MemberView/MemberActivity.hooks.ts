import { useRawActivities } from '@/api/hooks'
import { BasicMembershipFieldsFragment, StorageDataObjectFieldsFragment } from '@/api/queries'

export type NftActivitiesRecord = {
  id: string
  date: Date
  block: number
  video: {
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
  event: ReturnType<typeof useRawActivities>['activities'][0],
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
  const { activities: rawActivities, error, loading } = useRawActivities(memberId)
  const parsedActivities = rawActivities.map((a) => parseActivities(a, memberId))
  const activities = parsedActivities.filter((a): a is ActivitiesRecord => !!a)
  return {
    activities,
    error,
    loading,
  }
}
