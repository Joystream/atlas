import { QueryHookOptions } from '@apollo/client'
import BN from 'bn.js'
import { useCallback, useMemo, useState } from 'react'
import { useLocation } from 'react-router'

import { useRawNotifications } from '@/api/hooks/notifications'
import {
  GetNotificationsConnectionQuery,
  useGetNotificationsCountQuery,
} from '@/api/queries/__generated__/notifications.generated'
import { absoluteRoutes } from '@/config/routes'
import { useUser } from '@/providers/user/user.hooks'
import { whenDefined } from '@/utils/misc'

import { useNotificationStore } from './notifications.store'
import { NotificationData, NotificationRecord } from './notifications.types'

export type UseNotifications = ReturnType<typeof useNotifications>
export const useNotifications = (opts?: Pick<QueryHookOptions, 'notifyOnNetworkStatusChange'>) => {
  const { pathname } = useLocation()
  const isStudio = pathname.search(absoluteRoutes.studio.index()) !== -1
  const { accountId, channelId } = useUser()

  const recipientType = isStudio ? 'ChannelRecipient' : 'MemberRecipient'
  const recipientId = isStudio ? channelId : accountId

  const {
    notifications: rawNotifications,
    markNotificationsAsReadMutation,
    refetch,
    ...rest
  } = useRawNotifications(accountId ?? '', recipientType, opts)

  // those are different from unread notifications!
  const {
    lastSeenNotificationDates,
    actions: { setLastSeenNotificationDate: _setLastSeenNotificationDate },
  } = useNotificationStore()

  const unseenMemberNotificationsCount = useGetNotificationsCountQuery({
    variables: {
      where: {
        account: { joystreamAccount_eq: accountId },
        notificationType: { recipient: { isTypeOf_eq: 'MemberRecipient' } },
        createdAt_gt: whenDefined(
          lastSeenNotificationDates.find(({ type }) => type === 'MemberRecipient'),
          ({ date }) => new Date(date)
        ),
      },
    },
  })
  const unseenChannelNotificationsCount = useGetNotificationsCountQuery({
    variables: {
      where: {
        account: { joystreamAccount_eq: accountId },
        notificationType: { recipient: { isTypeOf_eq: 'ChannelRecipient' } },
        createdAt_gt: whenDefined(
          lastSeenNotificationDates.find(({ type }) => type === 'ChannelRecipient'), // TODO There should be one case per channel date pair and one more for non of the channel in lastSeenNotificationDates
          ({ date }) => new Date(date)
        ),
      },
    },
  })
  const unseenMemberNotifications =
    unseenMemberNotificationsCount.data?.notificationInAppDeliveriesConnection.totalCount
  const unseenChannelNotifications =
    unseenChannelNotificationsCount.data?.notificationInAppDeliveriesConnection.totalCount

  const [optimisticRead, setOptimisticRead] = useState<string[]>([])
  const notifications = useMemo(
    () =>
      rawNotifications.flatMap(({ node }): NotificationRecord | [] => {
        const { id, createdAt, status, notificationType } = node.notification
        const specificData = parseNotificationType(notificationType as NotificationType)
        return specificData
          ? {
              id,
              date: new Date(createdAt),
              read: status.__typename === 'Read' || optimisticRead.includes(id),
              ...specificData,
            }
          : []
      }),
    [rawNotifications, optimisticRead]
  )

  const markNotificationsAsRead = useCallback(
    async (notifications: NotificationRecord[]) => {
      const notificationIds = notifications.map(({ id }) => id)
      setOptimisticRead(notificationIds)
      const { errors } = await markNotificationsAsReadMutation({ variables: { notificationIds } })
      if (errors) {
        return setOptimisticRead([])
      }
      await refetch()
      setOptimisticRead([])
    },
    [markNotificationsAsReadMutation, refetch]
  )

  const setLastSeenNotificationDate = useCallback(
    (date: Date) => {
      if (!recipientId) return
      _setLastSeenNotificationDate(recipientType, recipientId, date)
    },
    [_setLastSeenNotificationDate, recipientType, recipientId]
  )
  const fetchMoreUnseen = useCallback(() => {
    unseenMemberNotificationsCount.fetchMore({})
    unseenChannelNotificationsCount.fetchMore({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unseenChannelNotificationsCount.fetchMore, unseenChannelNotificationsCount.fetchMore])

  return {
    notifications,
    unseenMemberNotifications,
    unseenChannelNotifications,
    unseenNotificationsCounts: isStudio ? unseenChannelNotifications : unseenMemberNotifications,
    fetchMoreUnseen,
    setLastSeenNotificationDate,
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
