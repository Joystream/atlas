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
  const commonFields: Omit<NftActivitiesRecord, 'text'> = {
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
        text: `${event.member.handle} placed a bid for `,
        type: 'bid',
        bidAmount: Number(event.bidAmount),
        member: event.member,
      }
    case 'NftBoughtEvent':
    case 'BidMadeCompletingAuctionEvent':
      if (memberId === event.ownerMember?.id) {
        return {
          ...commonFields,
          text: `${event.member.handle} sell for `,
          type: 'sale',
          price: Number(event.price),
          member: event.member,
          ownerMember: event.ownerMember || null,
        }
      } else {
        return {
          ...commonFields,
          text: `${event.member.handle} purchased for `,
          type: 'purchase',
          price: Number(event.price),
          member: event.member,
          ownerMember: event.ownerMember || null,
        }
      }
    case 'EnglishAuctionStartedEvent':
    case 'OpenAuctionStartedEvent':
    case 'NftSellOrderMadeEvent':
      return {
        ...commonFields,
        type: 'listing',
        text: `${event.ownerMember?.handle} listed NFT ${event.__typename === 'NftSellOrderMadeEvent' ? 'for ' : ''}`,
        member: event.ownerMember || null,
        price: event.__typename === 'NftSellOrderMadeEvent' ? Number(event.price) : undefined,
      }
    case 'AuctionCanceledEvent':
    case 'BuyNowCanceledEvent':
      return {
        ...commonFields,
        text: `${event.ownerMember?.handle} removed NFT from sale`,
        type: 'removal',
        member: event.ownerMember || null,
      }
    case 'NftIssuedEvent':
      return {
        ...commonFields,
        text: `${event.ownerMember?.handle} minted new NFT`,
        type: 'mint',
        member: event.ownerMember || null,
      }
    case 'AuctionBidCanceledEvent':
      return {
        ...commonFields,
        type: 'withdrawal',
        text: `${event.member.handle} withdrew a bid`,
        member: event.member,
      }
    case 'BuyNowPriceUpdatedEvent':
      return {
        ...commonFields,
        text: `${event.ownerMember?.handle} changed price to `,
        type: 'price-change',
        member: event.ownerMember || null,
        price: Number(event.newPrice),
      }
    case 'OpenAuctionBidAcceptedEvent':
      if (memberId === event.ownerMember?.id) {
        return {
          ...commonFields,
          text: `${event.ownerMember?.handle} sell for `,
          type: 'sale',
          price: Number(event.winningBid?.amount),
          member: event.winningBid?.bidder || null,
          ownerMember: event.ownerMember || null,
        }
      } else {
        return {
          ...commonFields,
          text: `${event.winningBid?.bidder.handle} purchased for `,
          type: 'purchase',
          price: Number(event.winningBid?.amount),
          member: event.winningBid?.bidder || null,
          ownerMember: event.ownerMember || null,
        }
      }

    default:
      return null
  }
}
