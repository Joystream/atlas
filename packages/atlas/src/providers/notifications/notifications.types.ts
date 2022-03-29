import { BasicMembershipFieldsFragment } from '@/api/queries'

type NftNotificationRecord = {
  id: string
  date: Date
  video: {
    id: string
    title: string
  }
  member: BasicMembershipFieldsFragment
}
export type NotificationRecord = { read?: boolean } & (
  | ({
      type: 'bid-made'
      bidAmount: number
    } & NftNotificationRecord)
  | ({
      type: 'bought'
    } & NftNotificationRecord)
  | ({
      type: 'open-auction-ended'
    } & NftNotificationRecord)
)
