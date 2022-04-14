import { useRawNotifications } from '@/api/hooks'
import { useUser } from '@/providers/user'
import { ConsoleLogger } from '@/utils/logs'

import { useNotificationStore } from './notifications.store'
import { NftNotificationRecord, NotificationRecord } from './notifications.types'

export const useNotifications = () => {
  const { activeMemberId } = useUser()
  const { notifications: rawNotifications, error, loading } = useRawNotifications(activeMemberId)
  const {
    readNotificationsIdsMap,
    lastSeenNotificationBlock,
    actions: { markNotificationsAsRead, markNotificationsAsUnread, setLastSeenNotificationBlock },
  } = useNotificationStore()
  const parsedNotifications = rawNotifications.map((n) => parseNotification(n, activeMemberId))
  const notifications = parsedNotifications.filter((n): n is NotificationRecord => !!n)
  const notificationsWithReadState = notifications.map((n) => ({ ...n, read: !!readNotificationsIdsMap[n.id] }))

  // those are different from unread notifications!
  const lastSeenNotificationIndex = notifications.findIndex(
    (notification) => notification.block <= lastSeenNotificationBlock
  )
  const unseenNotificationsCounts = lastSeenNotificationIndex === -1 ? notifications.length : lastSeenNotificationIndex

  return {
    notifications: notificationsWithReadState,
    unseenNotificationsCounts,
    setLastSeenNotificationBlock,
    markNotificationsAsRead,
    markNotificationsAsUnread,
    error,
    loading,
  }
}

const parseNotification = (
  event: ReturnType<typeof useRawNotifications>['notifications'][0],
  memberId: string | null
): NotificationRecord | null => {
  const commonFields: NftNotificationRecord = {
    id: event.id,
    date: event.createdAt,
    block: event.inBlock,
    video: {
      id: event.video.id,
      title: event.video.title || '',
    },
  }

  if (event.__typename === 'AuctionBidMadeEvent') {
    return {
      type: event.ownerMember?.id === memberId ? 'bid-made' : 'got-outbid',
      ...commonFields,
      member: event.member,
      bidAmount: Number(event.bidAmount),
    }
  } else if (event.__typename === 'NftBoughtEvent' || event.__typename === 'BidMadeCompletingAuctionEvent') {
    return {
      type: 'bought',
      ...commonFields,
      member: event.member,
      price: Number(event.price),
    }
  } else if (event.__typename === 'OpenAuctionBidAcceptedEvent') {
    return {
      type: 'open-auction-ended',
      ...commonFields,
      member: event.ownerMember || null,
      bidAmount: Number(event.winningBid?.amount || 0),
    }
  } else {
    ConsoleLogger.error('Unknown event type for notifications')
    return null
  }
}
