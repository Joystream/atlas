import { useRawActivities, useRawNotifications } from '@/api/hooks'
import { useUser } from '@/providers/user'
import { ConsoleLogger } from '@/utils/logs'

import { useNotificationStore } from './notifications.store'
import { ActivitiesRecord, NftActivitiesRecord, NftNotificationRecord, NotificationRecord } from './notifications.types'

export const useNotifications = () => {
  const { activeMemberId } = useUser()
  const { notifications: rawNotifications, ...rest } = useRawNotifications(activeMemberId, {
    fetchPolicy: 'cache-and-network', // this will make sure we will refetch every time member is changed
  })
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
    ...rest,
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
