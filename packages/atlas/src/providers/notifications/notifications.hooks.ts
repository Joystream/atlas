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

export type UseNotifications = ReturnType<typeof useNotifications>
export const useNotifications = (
  opts?: QueryHookOptions<GetNotificationsConnectionQuery, GetNotificationsConnectionQueryVariables>
) => {
  const { accountId, memberId } = useUser()
  const { notifications: rawNotifications, ...rest } = useRawNotifications(accountId ?? '', opts)
  const {
    readNotificationsIdsMap,
    lastSeenNotificationBlock,
    actions: { markNotificationsAsRead, markNotificationsAsUnread, setLastSeenNotificationBlock },
  } = useNotificationStore()
  const parsedNotifications = rawNotifications.map(({ node }) => node.event && parseNotification(node.event, memberId))
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

type NotificationEvent = NonNullable<
  GetNotificationsConnectionQuery['notificationsConnection']['edges'][number]['node']['event']
>

const getVideoDataFromEvent = (notificationEvent: NotificationEvent) => {
  switch (notificationEvent?.data.__typename) {
    case 'AuctionBidMadeEventData':
      return notificationEvent.data.bid.nft.video
    case 'BidMadeCompletingAuctionEventData':
    case 'EnglishAuctionSettledEventData':
    case 'OpenAuctionBidAcceptedEventData':
      return notificationEvent.data.winningBid.nft.video
    case 'CommentCreatedEventData':
      return notificationEvent.data.comment.video
    case 'NftBoughtEventData':
      return notificationEvent.data.nft.video

    default:
      return undefined
  }
}

const parseNotification = (
  notificationEvent: NotificationEvent,
  memberId: string | null
): NotificationRecord | null => {
  const video = getVideoDataFromEvent(notificationEvent)
  const commonFields: NftNotificationRecord = {
    id: notificationEvent.id,
    date: convertDateFormat(notificationEvent.timestamp),
    block: notificationEvent.inBlock,
    video: {
      id: video?.id || '',
      title: video?.title || '',
    },
  }

  if (notificationEvent.data.__typename === 'AuctionBidMadeEventData') {
    return {
      type: notificationEvent.data.bid.previousTopBid?.bidder.id === memberId ? 'got-outbid' : 'bid-made',
      ...commonFields,
      member: notificationEvent.data.bid.bidder as BasicMembershipFieldsFragment,
      bidAmount: new BN(notificationEvent.data.bid.amount),
    }
  } else if (notificationEvent.data.__typename === 'NftBoughtEventData') {
    return {
      type: 'bought',
      ...commonFields,
      member: notificationEvent.data.buyer as BasicMembershipFieldsFragment,
      price: new BN(notificationEvent.data.price),
    }
  } else if (notificationEvent.data.__typename === 'BidMadeCompletingAuctionEventData') {
    if (notificationEvent.data.winningBid.bidder.id !== memberId) {
      // member is the owner, somebody bought their NFT
      return {
        type: 'bought',
        ...commonFields,
        member: notificationEvent.data.winningBid.bidder as BasicMembershipFieldsFragment,
        price: new BN(notificationEvent.data.winningBid.amount),
      }
    } else if (notificationEvent.data.winningBid.bidder.id === memberId) {
      // member is the winner, skip the notification
      return null
    } else {
      // member is not the owner and not the winner, they participated in the auction
      return {
        type: 'auction-ended',
        ...commonFields,
      }
    }
  } else if (notificationEvent.data.__typename === 'OpenAuctionBidAcceptedEventData') {
    if (notificationEvent.data.winningBid?.bidder.id === memberId) {
      // member is the previous owner, he accepted a bid
      return {
        type: 'bid-accepted',
        ...commonFields,
        member:
          (notificationEvent.data.previousNftOwner.__typename === 'NftOwnerChannel'
            ? notificationEvent.data.previousNftOwner.channel.ownerMember
            : notificationEvent.data.previousNftOwner.member) || null,
        bidAmount: new BN(notificationEvent.data.winningBid?.amount || 0),
      }
    } else {
      // member is not the winner, the participated in the auction
      return {
        type: 'auction-ended',
        ...commonFields,
      }
    }
  } else if (notificationEvent.data.__typename === 'EnglishAuctionSettledEventData') {
    if (notificationEvent.data.winningBid.bidder?.id !== memberId) {
      // member is the owner, their auction got settled
      return {
        type: 'auction-settled-owner',
        ...commonFields,
      }
    } else if (notificationEvent.data.winningBid.bidder.id === memberId) {
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
    notificationEvent.data.__typename === 'CommentCreatedEventData' &&
    !notificationEvent.data.comment.parentComment
  ) {
    return {
      type: 'video-commented',
      member: notificationEvent.data.comment.author as BasicMembershipFieldsFragment,
      commentId: notificationEvent.data.comment.id,
      ...commonFields,
    }
  } else if (
    notificationEvent.data.__typename === 'CommentCreatedEventData' &&
    notificationEvent.data.comment.parentComment
  ) {
    return {
      type: 'comment-reply',
      member: notificationEvent.data.comment.author as BasicMembershipFieldsFragment,
      commentId: notificationEvent.data.comment.id,
      ...commonFields,
    }
  } else {
    ConsoleLogger.error('Unknown event type for notifications')
    return null
  }
}
