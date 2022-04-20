import { BasicMembershipFieldsFragment, StorageDataObjectFieldsFragment } from '@/api/queries'

export type NftNotificationRecord = {
  id: string
  date: Date
  block: number
  video: {
    id: string
    title: string
  }
}
export type NotificationRecord = { read?: boolean } & (
  | ({
      type: 'bid-made'
      bidAmount: number
      member: BasicMembershipFieldsFragment
    } & NftNotificationRecord)
  | ({
      type: 'bought'
      price: number
      member: BasicMembershipFieldsFragment
    } & NftNotificationRecord)
  | ({
      type: 'open-auction-ended'
      member: BasicMembershipFieldsFragment | null
      bidAmount: number
    } & NftNotificationRecord)
  | ({
      type: 'got-outbid'
      member: BasicMembershipFieldsFragment
      bidAmount: number
    } & NftNotificationRecord)
)

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
