import { useRawNotifications } from '@/api/hooks'
import { ConsoleLogger } from '@/utils/logs'

import { useNotificationStore } from './notifications.store'
import { NotificationRecord } from './notifications.types'

export const useNotifications = () => {
  const { notifications: rawNotifications, error, loading } = useRawNotifications()
  const {
    readNotificationsIdsMap,
    actions: { markNotificationsAsRead },
  } = useNotificationStore()
  const parsedNotifications = rawNotifications.map((n) => parseNotification(n))
  const notifications = parsedNotifications.filter((n): n is NotificationRecord => !!n)
  const notificationsWithReadState = notifications.map((n) => ({ ...n, read: !!readNotificationsIdsMap[n.id] }))
  return {
    notifications: notificationsWithReadState,
    markNotificationsAsRead,
    error,
    loading,
  }
}

const parseNotification = (
  event: ReturnType<typeof useRawNotifications>['notifications'][0]
): NotificationRecord | null => {
  if (event.__typename === 'AuctionBidMadeEvent') {
    return {
      id: event.id,
      type: 'bid-made',
      date: event.createdAt,
      member: event.member,
      video: {
        id: event.video.id,
        title: event.video.title || '',
      },
      bidAmount: Number(event.bidAmount),
    }
  } else if (event.__typename === 'NftBoughtEvent' || event.__typename === 'BidMadeCompletingAuctionEvent') {
    return {
      id: event.id,
      type: 'bought',
      date: event.createdAt,
      member: event.member,
      video: {
        id: event.video.id,
        title: event.video.title || '',
      },
    }
  } else if (event.__typename === 'OpenAuctionBidAcceptedEvent') {
    return {
      id: event.id,
      type: 'open-auction-ended',
      date: event.createdAt,
      // TODO: this will be accessible directly on event object in the future
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      member: event.video.nft!.ownerMember!,
      video: {
        id: event.video.id,
        title: event.video.title || '',
      },
    }
  } else {
    ConsoleLogger.error('Unknown event type for notifications')
    return null
  }
}
