import { QueryHookOptions } from '@apollo/client'
import BN from 'bn.js'

import { useRawNotifications } from '@/api/hooks/notifications'
import { BasicMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import {
  GetNotificationsConnectionQuery,
  GetNotificationsConnectionQueryVariables,
} from '@/api/queries/__generated__/notifications.generated'
import { useUser } from '@/providers/user/user.hooks'
import { ConsoleLogger } from '@/utils/logs'
import { convertDateFormat } from '@/utils/time'

import { useNotificationStore } from './notifications.store'
import { NftNotificationRecord, NotificationRecord } from './notifications.types'

export const useNotifications = (
  opts?: QueryHookOptions<GetNotificationsConnectionQuery, GetNotificationsConnectionQueryVariables>
) => {
  const { memberId } = useUser()
  const { notifications: rawNotifications, ...rest } = useRawNotifications(memberId, opts)
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

const getVideoDataFromEvent = ({
  node: notification,
}: GetNotificationsConnectionQuery['notificationsConnection']['edges'][number]) => {
  switch (notification.event.data.__typename) {
    case 'AuctionBidMadeEventData':
      return notification.event.data.bid.nft.video
    case 'BidMadeCompletingAuctionEventData':
    case 'EnglishAuctionSettledEventData':
    case 'OpenAuctionBidAcceptedEventData':
      return notification.event.data.winningBid.nft.video
    case 'CommentCreatedEventData':
      return notification.event.data.comment.video
    case 'NftBoughtEventData':
      return notification.event.data.nft.video

    default:
      return undefined
  }
}

const parseNotification = (
  result: GetNotificationsConnectionQuery['notificationsConnection']['edges'][number],
  memberId: string | null
): NotificationRecord | null => {
  const notification = result.node
  const video = getVideoDataFromEvent(result)
  const commonFields: NftNotificationRecord = {
    id: notification.event.id,
    date: convertDateFormat(notification.event.timestamp),
    block: notification.event.inBlock,
    video: {
      id: video?.id || '',
      title: video?.title || '',
    },
  }

  if (notification.event.data.__typename === 'AuctionBidMadeEventData') {
    return {
      type: notification.event.data.bid.previousTopBid?.bidder.id === memberId ? 'got-outbid' : 'bid-made',
      ...commonFields,
      member: notification.event.data.bid.bidder as BasicMembershipFieldsFragment,
      bidAmount: new BN(notification.event.data.bid.amount),
    }
  } else if (notification.event.data.__typename === 'NftBoughtEventData') {
    return {
      type: 'bought',
      ...commonFields,
      member: notification.event.data.buyer as BasicMembershipFieldsFragment,
      price: new BN(notification.event.data.price),
    }
  } else if (notification.event.data.__typename === 'BidMadeCompletingAuctionEventData') {
    if (notification.event.data.winningBid.bidder.id !== memberId) {
      // member is the owner, somebody bought their NFT
      return {
        type: 'bought',
        ...commonFields,
        member: notification.event.data.winningBid.bidder as BasicMembershipFieldsFragment,
        price: new BN(notification.event.data.winningBid.amount),
      }
    } else if (notification.event.data.winningBid.bidder.id === memberId) {
      // member is the winner, skip the notification
      return null
    } else {
      // member is not the owner and not the winner, they participated in the auction
      return {
        type: 'auction-ended',
        ...commonFields,
      }
    }
  } else if (notification.event.data.__typename === 'OpenAuctionBidAcceptedEventData') {
    if (notification.event.data.winningBid?.bidder.id === memberId) {
      // member is the previous owner, he accepted a bid
      return {
        type: 'bid-accepted',
        ...commonFields,
        member:
          (notification.event.data.previousNftOwner.__typename === 'NftOwnerChannel'
            ? notification.event.data.previousNftOwner.channel.ownerMember
            : notification.event.data.previousNftOwner.member) || null,
        bidAmount: new BN(notification.event.data.winningBid?.amount || 0),
      }
    } else {
      // member is not the winner, the participated in the auction
      return {
        type: 'auction-ended',
        ...commonFields,
      }
    }
  } else if (notification.event.data.__typename === 'EnglishAuctionSettledEventData') {
    if (notification.event.data.winningBid.bidder?.id !== memberId) {
      // member is the owner, their auction got settled
      return {
        type: 'auction-settled-owner',
        ...commonFields,
      }
    } else if (notification.event.data.winningBid.bidder.id === memberId) {
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
  } else if (
    notification.event.data.__typename === 'CommentCreatedEventData' &&
    !notification.event.data.comment.parentComment
  ) {
    return {
      type: 'video-commented',
      member: notification.event.data.comment.author as BasicMembershipFieldsFragment,
      commentId: notification.event.data.comment.id,
      ...commonFields,
    }
  } else if (
    notification.event.data.__typename === 'CommentCreatedEventData' &&
    notification.event.data.comment.parentComment
  ) {
    return {
      type: 'comment-reply',
      member: notification.event.data.comment.author as BasicMembershipFieldsFragment,
      commentId: notification.event.data.comment.id,
      ...commonFields,
    }
  } else {
    ConsoleLogger.error('Unknown event type for notifications')
    return null
  }
}
