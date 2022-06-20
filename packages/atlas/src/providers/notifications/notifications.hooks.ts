import { useRawNotifications } from '@/api/hooks'
import { useUser } from '@/providers/user'
import { ConsoleLogger } from '@/utils/logs'

import { useNotificationStore } from './notifications.store'
import { NftNotificationRecord, NotificationRecord } from './notifications.types'

export const useNotifications = () => {
  const { memberId, channelId } = useUser()
  const { notifications: rawNotifications, ...rest } = useRawNotifications(channelId, memberId, {
    context: { delay: 3000 },
  })
  const {
    readNotificationsIdsMap,
    lastSeenNotificationBlock,
    actions: { markNotificationsAsRead, markNotificationsAsUnread, setLastSeenNotificationBlock },
  } = useNotificationStore()
  const parsedNotifications = rawNotifications.map((n) => parseNotification(n, memberId))
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
  } else if (event.__typename === 'NftBoughtEvent') {
    return {
      type: 'bought',
      ...commonFields,
      member: event.member,
      price: Number(event.price),
    }
  } else if (event.__typename === 'BidMadeCompletingAuctionEvent') {
    if (event.ownerMember?.id === memberId) {
      // member is the owner, somebody bought their NFT
      return {
        type: 'bought',
        ...commonFields,
        member: event.member,
        price: Number(event.price),
      }
    } else if (event.member.id === memberId) {
      // member is the winner, skip the notification
      return null
    } else {
      // member is not the owner and not the winner, they participated in the auction
      return {
        type: 'auction-ended',
        ...commonFields,
      }
    }
  } else if (event.__typename === 'OpenAuctionBidAcceptedEvent') {
    if (event.winningBidder?.id === memberId) {
      // member is the winner, their bid was accepted
      return {
        type: 'bid-accepted',
        ...commonFields,
        member: event.ownerMember || null,
        bidAmount: Number(event.winningBid?.amount || 0),
      }
    } else {
      // member is not the winner, the participated in the auction
      return {
        type: 'auction-ended',
        ...commonFields,
      }
    }
  } else if (event.__typename === 'EnglishAuctionSettledEvent') {
    if (event.ownerMember?.id === memberId) {
      // member is the owner, their auction got settled
      return {
        type: 'auction-settled-owner',
        ...commonFields,
      }
    } else if (event.winner.id === memberId) {
      // member is the winner, auction they won got settled
      return {
        type: 'auction-settled-winner',
        ...commonFields,
      }
    } else {
      // member is not the owner and not the winner, they participated in the auction
      return {
        type: 'auction-ended',
        ...commonFields,
      }
    }
  } else if (event.__typename === 'CommentCreatedEvent' && !event.comment.parentComment) {
    return {
      type: 'video-commented',
      member: event.comment.author,
      commentId: event.comment.id,
      ...commonFields,
    }
  } else if (event.__typename === 'CommentCreatedEvent' && event.comment.parentComment) {
    return {
      type: 'comment-reply',
      member: event.comment.author,
      commentId: event.comment.id,
      ...commonFields,
    }
  } else {
    ConsoleLogger.error('Unknown event type for notifications')
    return null
  }
}
