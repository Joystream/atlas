import { QueryHookOptions } from '@apollo/client'
import BN from 'bn.js'
import { useCallback, useMemo, useState } from 'react'
import { useLocation } from 'react-router'

import { useRawNotifications } from '@/api/hooks/notifications'
import { RecipientTypeWhereInput } from '@/api/queries/__generated__/baseTypes.generated'
import {
  GetNotificationsConnectionQuery,
  useGetNotificationsCountQuery,
} from '@/api/queries/__generated__/notifications.generated'
import { absoluteRoutes } from '@/config/routes'
import { useUser } from '@/providers/user/user.hooks'
import { whenDefined } from '@/utils/misc'

import { RecipientType, useNotificationStore } from './notifications.store'
import { NotificationData, NotificationRecord } from './notifications.types'

export type UseNotifications = ReturnType<typeof useNotifications>
export const useNotifications = (opts?: Pick<QueryHookOptions, 'notifyOnNetworkStatusChange'>) => {
  const { pathname } = useLocation()
  const isStudio = pathname.search(absoluteRoutes.studio.index()) !== -1
  const { channelId, memberId } = useUser()

  const recipientType: RecipientType = isStudio ? 'ChannelRecipient' : 'MemberRecipient'
  const recipientId = isStudio ? channelId : memberId
  const recipient: RecipientTypeWhereInput | undefined = whenDefined(recipientId, (id_eq) =>
    isStudio
      ? { isTypeOf_eq: recipientType, channel: { id_eq } }
      : { isTypeOf_eq: recipientType, membership: { id_eq } }
  )

  const {
    notifications: rawNotifications,
    markNotificationsAsReadMutation,
    refetch,
    ...rest
  } = useRawNotifications(recipient, opts)

  // those are different from unread notifications!
  const {
    lastSeenNotificationDates,
    actions: { setLastSeenNotificationDate: _setLastSeenNotificationDate },
  } = useNotificationStore()

  const unseenMemberNotificationsCount = useGetNotificationsCountQuery({
    variables: {
      where: {
        recipient: { isTypeOf_eq: 'MemberRecipient', membership: { id_eq: memberId } },
        createdAt_gt: whenDefined(
          lastSeenNotificationDates.find(({ type }) => type === 'MemberRecipient'),
          ({ date }) => new Date(date)
        ),
      },
    },
  })

  const channels = channelId ? [channelId] : [] // TODO
  const unseenChannelNotificationsCount = useGetNotificationsCountQuery({
    variables: {
      where: {
        OR: channels.map((id) => ({
          recipient: { isTypeOf_eq: 'ChannelRecipient', channel: { id_eq: id } },
          createdAt_gt: whenDefined(
            lastSeenNotificationDates.find(({ type }) => type === 'ChannelRecipient'), // TODO There should be one case per channel date pair and one more for non of the channel in lastSeenNotificationDates
            ({ date }) => new Date(date)
          ),
        })),
      },
    },
  })

  const unseenMemberNotifications = unseenMemberNotificationsCount.data?.notificationsConnection.totalCount
  const unseenChannelNotifications = unseenChannelNotificationsCount.data?.notificationsConnection.totalCount

  const [optimisticRead, setOptimisticRead] = useState<string[]>([])
  const notifications = useMemo(
    () =>
      rawNotifications.map(
        ({ node: { id, createdAt, status, notificationType } }): NotificationRecord => ({
          id,
          date: new Date(createdAt),
          read: status.__typename === 'Read' || optimisticRead.includes(id),
          ...parseNotificationType(notificationType as NotificationType),
        })
      ),
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
  GetNotificationsConnectionQuery['notificationsConnection']['edges'][number]['node']['notificationType']

const parseNotificationType = (notificationType: NotificationType): NotificationData => {
  switch (notificationType.__typename) {
    case 'ChannelFundsWithdrawn':
    case 'CreatorReceivesAuctionBid':
    case 'DirectChannelPaymentByMember':
    case 'NftRoyaltyPaid':
      return toNotificationData(notificationType, { amount: new BN(notificationType.amount) })

    // case 'EnglishAuctionSettled':
    case 'NftPurchased':
      return toNotificationData(notificationType, { price: new BN(notificationType.price) })

    case 'AuctionWon':
    case 'AuctionLost':
      return toNotificationData(notificationType, { auction: notificationType.type.__typename })

    case 'ChannelCreated':
    case 'CommentReply':
    case 'ReactionToComment':
    case 'VideoPosted':
    case 'NewNftOnSale':
    case 'NewAuction':
    case 'HigherBidPlaced':
    case 'ChannelExcluded':
    case 'VideoExcluded':
    case 'NftFeaturedOnMarketPlace':
    case 'NewChannelFollower':
    case 'CommentPostedToVideo':
    case 'VideoLiked':
    case 'VideoDisliked':
    case 'ChannelVerified':
    case 'ChannelSuspended':
      return toNotificationData(notificationType, {})
  }
}

type TypenameOf<T> = T extends { __typename: infer Typename } ? Typename : never
type NotifDataOfType<T> = NotificationData extends infer D ? (D extends { type: T } ? D : never) : never

const toNotificationData = <T extends NotificationType, R extends NotifDataOfType<TypenameOf<T>>>(
  notificationType: T,
  data: Partial<R>
) => {
  const { __typename, ...rest } = notificationType
  return { type: __typename as T['__typename'], ...rest, ...data } as unknown as R
}
