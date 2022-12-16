import BN from 'bn.js'

import { useRawNotifications } from '@/api/hooks/notifications'
import { BasicMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { useUser } from '@/providers/user/user.hooks'
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
  event: ReturnType<typeof useRawNotifications>['notifications'][number],
  memberId: string | null
): NotificationRecord | null => {
  const commonFields: NftNotificationRecord = {
    id: event.id,
    date: event.timestamp,
    block: event.inBlock,
    video: {
      // todo get correct video id. It depends on the event
      id: event.id,
      // todo get correct video title. It depends on the event
      title: 'dummy',
    },
  }

  if (event.data.__typename === 'AuctionBidMadeEventData') {
    return {
      // todo make sure that's working
      type: event.data.bid.previousTopBid?.bidder.id === memberId ? 'got-outbid' : 'bid-made',
      ...commonFields,
      member: event.data.bid.bidder as BasicMembershipFieldsFragment,
      bidAmount: new BN(event.data.bid.amount),
    }
  } else if (event.data.__typename === 'NftBoughtEventData') {
    return {
      type: 'bought',
      ...commonFields,
      member: event.data.buyer as BasicMembershipFieldsFragment,
      price: new BN(event.data.price),
    }
  } else if (event.data.__typename === 'BidMadeCompletingAuctionEventData') {
    if (event.data.winningBid.bidder.id !== memberId) {
      // member is the owner, somebody bought their NFT
      return {
        type: 'bought',
        ...commonFields,
        member: event.data.winningBid.bidder as BasicMembershipFieldsFragment,
        price: new BN(event.data.winningBid.amount),
      }
    } else if (event.data.winningBid.bidder.id === memberId) {
      // member is the winner, skip the notification
      return null
    } else {
      // member is not the owner and not the winner, they participated in the auction
      return {
        type: 'auction-ended',
        ...commonFields,
      }
    }
  } else if (event.data.__typename === 'OpenAuctionBidAcceptedEventData') {
    if (event.data.winningBid?.bidder.id === memberId) {
      // member is the winner, their bid was accepted
      return {
        type: 'bid-accepted',
        ...commonFields,
        member: (event.data.winningBid?.bidder as BasicMembershipFieldsFragment) || null,
        bidAmount: new BN(event.data.winningBid?.amount || 0),
      }
    } else {
      // member is not the winner, the participated in the auction
      return {
        type: 'auction-ended',
        ...commonFields,
      }
    }
  } else if (event.data.__typename === 'EnglishAuctionSettledEventData') {
    if (event.data.winningBid.bidder?.id !== memberId) {
      // member is the owner, their auction got settled
      return {
        type: 'auction-settled-owner',
        ...commonFields,
      }
    } else if (event.data.winningBid.bidder.id === memberId) {
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
  } else if (event.data.__typename === 'CommentCreatedEventData' && !event.data.comment.parentComment) {
    return {
      type: 'video-commented',
      member: event.data.comment.author as BasicMembershipFieldsFragment,
      commentId: event.data.comment.id,
      ...commonFields,
    }
  } else if (event.data.__typename === 'CommentCreatedEventData' && event.data.comment.parentComment) {
    return {
      type: 'comment-reply',
      member: event.data.comment.author as BasicMembershipFieldsFragment,
      commentId: event.data.comment.id,
      ...commonFields,
    }
  } else {
    ConsoleLogger.error('Unknown event type for notifications')
    return null
  }
}
