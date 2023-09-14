import { QueryHookOptions } from '@apollo/client'
import BN from 'bn.js'
import { useState } from 'react'
import { useLocation } from 'react-router'

import { useRawNotifications } from '@/api/hooks/notifications'
import { GetNotificationsConnectionQuery } from '@/api/queries/__generated__/notifications.generated'
import { absoluteRoutes } from '@/config/routes'
import { useUser } from '@/providers/user/user.hooks'

import { useNotificationStore } from './notifications.store'
import { NotificationData, NotificationRecord } from './notifications.types'

export type UseNotifications = ReturnType<typeof useNotifications>
export const useNotifications = (opts?: Pick<QueryHookOptions, 'notifyOnNetworkStatusChange'>) => {
  const { pathname } = useLocation()
  const isStudio = pathname.search(absoluteRoutes.studio.index()) !== -1
  const { accountId } = useUser()

  const {
    notifications: rawNotifications,
    markNotificationsAsReadMutation,
    refetch,
    ...rest
  } = useRawNotifications(accountId ?? '', isStudio ? 'ChannelRecipient' : 'MemberRecipient', opts)

  const {
    lastSeenNotificationBlock,
    actions: { setLastSeenNotificationBlock },
  } = useNotificationStore()

  const [optimisticRead, setOptimisticRead] = useState<string[]>([])
  const notifications = rawNotifications.flatMap(({ node }): NotificationRecord | [] => {
    const { id, createdAt, status, notificationType } = node.notification
    const date = new Date(createdAt)
    const specificData = parseNotificationType(notificationType as NotificationType)
    return specificData
      ? {
          id,
          date: date,
          block: date.getTime(), // TODO rename this field since it's not block anymore
          read: status.__typename === 'Read' || optimisticRead.includes(id),
          ...specificData,
        }
      : []
  })

  // those are different from unread notifications!
  const lastSeenNotificationIndex = notifications.findIndex(
    (notification) => notification.block <= lastSeenNotificationBlock
  )
  const unseenNotificationsCounts = lastSeenNotificationIndex === -1 ? notifications.length : lastSeenNotificationIndex

  const markNotificationsAsRead = async (notifications: NotificationRecord[]) => {
    const notificationIds = notifications.map(({ id }) => id)
    setOptimisticRead(notificationIds)
    const { errors } = await markNotificationsAsReadMutation({ variables: { notificationIds } })
    if (errors) {
      return setOptimisticRead([])
    }
    await refetch()
    setOptimisticRead([])
  }

  return {
    notifications,
    unseenNotificationsCounts,
    setLastSeenNotificationBlock,
    markNotificationsAsRead,
    ...rest,
  }
}

type NotificationType =
  GetNotificationsConnectionQuery['notificationInAppDeliveriesConnection']['edges'][number]['node']['notification']['notificationType']

const parseNotificationType = (notificationType: NotificationType): NotificationData | undefined => {
  switch (notificationType.__typename) {
    case 'ChannelFundsWithdrawn':
    case 'CreatorReceivesAuctionBid':
    case 'DirectChannelPaymentByMember':
    case 'NftRoyaltyPaid':
      return toNotificationData(notificationType, { amount: new BN(notificationType.amount) })

    case 'EnglishAuctionSettled':
    case 'NftPurchased':
      return toNotificationData(notificationType, { price: new BN(notificationType.price) })

    case 'ChannelCreated':
    case 'CommentReply':
    case 'ReactionToComment':
    case 'VideoPosted':
    case 'NewNftOnSale':
    case 'NewAuction':
    case 'HigherBidPlaced':
    case 'EnglishAuctionWon':
    case 'EnglishAuctionLost':
    case 'OpenAuctionWon':
    case 'OpenAuctionLost':
    case 'ChannelExcluded':
    case 'VideoExcluded':
    case 'VideoFeaturedOnCategoryPage':
    case 'NftFeaturedOnMarketPlace':
    case 'VideoFeaturedAsCategoryHero':
    case 'NewChannelFollower':
    case 'CommentPostedToVideo':
    case 'VideoLiked':
    case 'VideoDisliked':
    case 'ChannelVerified':
    case 'ChannelSuspended':
      return toNotificationData(notificationType, {})
  }
}

type ToNotificationData<T, K extends keyof T> = T extends { __typename: infer U }
  ? Omit<T, '__typename' | K> extends infer V
    ? { type: U } & { [k in K]: BN } & V
    : never
  : never

const toNotificationData = <T extends { __typename: string }, K extends Exclude<keyof T, '__typename'> | never>(
  notificationType: T,
  data: { [k in K]: BN }
) => {
  const { __typename, ...rest } = notificationType
  return { type: __typename as T['__typename'], ...rest, ...data } as unknown as ToNotificationData<T, K>
}
