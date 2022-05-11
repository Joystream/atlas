import { BasicMembershipFieldsFragment } from '@/api/queries'

export type NftNotificationRecord = {
  id: string
  date: Date
  block: number
  video: {
    id: string
    title: string
  }
  member?: BasicMembershipFieldsFragment | null
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
      type: 'bid-accepted'
      member: BasicMembershipFieldsFragment | null
      bidAmount: number
    } & NftNotificationRecord)
  | ({
      type: 'got-outbid'
      member: BasicMembershipFieldsFragment
      bidAmount: number
    } & NftNotificationRecord)
  | ({
      type: 'auction-settled-owner'
    } & NftNotificationRecord)
  | ({
      type: 'auction-settled-winner'
    } & NftNotificationRecord)
  | ({
      type: 'auction-ended'
    } & NftNotificationRecord)
)
