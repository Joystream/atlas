import { QueryHookOptions } from '@apollo/client'
import BN from 'bn.js'
import { useState } from 'react'

import { useRawNotifications } from '@/api/hooks/notifications'
import {
  GetChannelNotificationsConnectionQuery,
  GetMembershipNotificationsConnectionQuery,
} from '@/api/queries/__generated__/notifications.generated'
import { useUser } from '@/providers/user/user.hooks'

import { useNotificationStore } from './notifications.store'
import { NotificationData, NotificationRecord } from './notifications.types'

export type UseNotificationsOptions = Pick<QueryHookOptions, 'notifyOnNetworkStatusChange'> & {
  type?: 'membership' | 'channel'
}

export type UseNotifications = ReturnType<typeof useNotifications>
export const useNotifications = (opts?: UseNotificationsOptions) => {
  const { accountId } = useUser()
  const {
    notifications: rawNotifications,
    markNotificationsAsReadMutation,
    refetch,
    ...rest
  } = useRawNotifications(accountId ?? '', opts)

  const {
    lastSeenNotificationBlock,
    actions: { setLastSeenNotificationBlock },
  } = useNotificationStore()

  const [optimisticRead, setOptimisticRead] = useState<string[]>([])
  const notifications = rawNotifications.map(({ node }): NotificationRecord => {
    const { id, createdAt, status, notificationType } = node.notification
    return {
      id,
      date: createdAt,
      block: createdAt.getTime(), // TODO rename this field since it's not block anymore
      read: status.__typename === 'Read' || optimisticRead.includes(id),
      ...parseNotificationType(notificationType as NotificationType),
    }
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

type QueriedTypes<T extends { __typename?: string }> = T extends { __typename: infer U }
  ? U extends string
    ? T
    : never
  : never

type NotificationType = QueriedTypes<
  | GetMembershipNotificationsConnectionQuery['notificationInAppDeliveriesConnection']['edges'][number]['node']['notification']['notificationType']
  | GetChannelNotificationsConnectionQuery['notificationInAppDeliveriesConnection']['edges'][number]['node']['notification']['notificationType']
>

const parseNotificationType = (notificationType: NotificationType): NotificationData => {
  switch (notificationType.__typename) {
    case 'ChannelFundsWithdrawn':
    case 'CreatorReceivesAuctionBid':
    case 'DirectChannelPaymentByMember':
    case 'NftRoyaltyPaid':
      return toNotificationData(notificationType, { 'amount': new BN(notificationType.amount) })

    case 'EnglishAuctionSettled':
    case 'NftPurchased':
      return toNotificationData(notificationType, { price: new BN(notificationType.price) })

    default:
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
