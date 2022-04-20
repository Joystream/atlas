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
  text: string
  block: number
  video: {
    id: string
    title: string
    thumbnailPhoto: StorageDataObjectFieldsFragment | null
  }
}
export type ActivitiesRecord =
  | ({
      type: 'bid'
      bidAmount: number
      member: BasicMembershipFieldsFragment
    } & NftActivitiesRecord)
  | ({
      type: 'purchase'
      member: BasicMembershipFieldsFragment | null
      price: number
      ownerMember: BasicMembershipFieldsFragment | null
    } & NftActivitiesRecord)
  | ({
      type: 'withdrawal'
      member: BasicMembershipFieldsFragment
    } & NftActivitiesRecord)
  | ({
      type: 'sale'
      member: BasicMembershipFieldsFragment | null
      price: number
      ownerMember: BasicMembershipFieldsFragment | null
    } & NftActivitiesRecord)
  | ({
      type: 'removal'
      member: BasicMembershipFieldsFragment | null
    } & NftActivitiesRecord)
  | ({
      type: 'transfer'
      member: BasicMembershipFieldsFragment
    } & NftActivitiesRecord)
  | ({
      type: 'listing'
      member: BasicMembershipFieldsFragment | null
      price?: number
    } & NftActivitiesRecord)
  | ({
      type: 'mint'
      member: BasicMembershipFieldsFragment | null
    } & NftActivitiesRecord)
  | ({
      type: 'price-change'
      member: BasicMembershipFieldsFragment | null
      price: number
    } & NftActivitiesRecord)
