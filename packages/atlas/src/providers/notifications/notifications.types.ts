import { BasicMembershipFieldsFragment } from '@/api/queries'

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
