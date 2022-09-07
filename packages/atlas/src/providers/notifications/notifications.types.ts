import BN from 'bn.js'

import { BasicMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'

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
      bidAmount: BN
      member: BasicMembershipFieldsFragment
    } & NftNotificationRecord)
  | ({
      type: 'bought'
      price: BN
      member: BasicMembershipFieldsFragment
    } & NftNotificationRecord)
  | ({
      type: 'bid-accepted'
      member: BasicMembershipFieldsFragment | null
      bidAmount: BN
    } & NftNotificationRecord)
  | ({
      type: 'got-outbid'
      member: BasicMembershipFieldsFragment
      bidAmount: BN
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
  | ({
      type: 'video-commented'
      commentId: string
    } & NftNotificationRecord)
  | ({
      type: 'comment-reply'
      commentId: string
    } & NftNotificationRecord)
)
