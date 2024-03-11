import { QueryHookOptions, QueryResult, useApolloClient } from '@apollo/client'
import BN from 'bn.js'
import { sum } from 'lodash-es'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router'

import { useRawNotifications } from '@/api/hooks/notifications'
import { RecipientTypeWhereInput } from '@/api/queries/__generated__/baseTypes.generated'
import {
  GetNotificationsConnectionQuery,
  GetNotificationsCountDocument,
  GetNotificationsCountQuery,
  GetNotificationsCountQueryVariables,
  useGetNotificationsCountQuery,
} from '@/api/queries/__generated__/notifications.generated'
import { absoluteRoutes } from '@/config/routes'
import { useUser } from '@/providers/user/user.hooks'
import { whenDefined } from '@/utils/misc'

import { NotificationsStoreState, RecipientType, useNotificationStore } from './notifications.store'
import { NotificationData, NotificationRecord } from './notifications.types'

type UnseenNotificationsCounts = {
  member?: number
  channels?: { channels: Map<string, number>; total: number; current: number }
  fetchMore: () => void
}

export type UseNotifications = Pick<QueryResult<GetNotificationsConnectionQuery>, 'loading' | 'fetchMore'> & {
  notifications: NotificationRecord[]
  unseenNotificationsCounts: UnseenNotificationsCounts
  setLastSeenNotificationDate: (data: Date) => void
  markNotificationsAsRead: (notifications: NotificationRecord[]) => void
  pageInfo?: GetNotificationsConnectionQuery['notificationsConnection']['pageInfo']
  recipient: RecipientTypeWhereInput | undefined
}

export const useNotifications = (opts?: Pick<QueryHookOptions, 'notifyOnNetworkStatusChange'>): UseNotifications => {
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

  const unseenMemberNotifications = useUnseenMemberNotifications(lastSeenNotificationDates)
  const unseenChannelNotifications = useUnseenChannelNotifications(lastSeenNotificationDates)

  const fetchMoreUnseen = useCallback(() => {
    unseenMemberNotifications.fetchMore({})
    unseenChannelNotifications.fetchMore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unseenMemberNotifications.fetchMore, unseenChannelNotifications.fetchMore])

  const unseenNotificationsCounts: UnseenNotificationsCounts = useMemo(
    () => ({
      member: unseenMemberNotifications.data,
      channels: unseenChannelNotifications.data,
      fetchMore: fetchMoreUnseen,
    }),
    [unseenMemberNotifications, unseenChannelNotifications, fetchMoreUnseen]
  )

  const [optimisticRead, setOptimisticRead] = useState<string[]>([])
  const notifications: NotificationRecord[] = useMemo(
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

  return {
    ...rest,
    notifications,
    unseenNotificationsCounts,
    setLastSeenNotificationDate,
    markNotificationsAsRead,
    recipient,
  }
}

const useUnseenMemberNotifications = (
  lastSeenNotificationDates: NotificationsStoreState['lastSeenNotificationDates']
) => {
  const { memberId } = useUser()

  const where = useMemo(() => {
    const recipient = { isTypeOf_eq: 'MemberRecipient', membership: { id_eq: memberId } }
    const createdAt_gt = whenDefined(
      lastSeenNotificationDates.find(({ type, id }) => type === 'MemberRecipient' && id === memberId),
      ({ date }) => new Date(date)
    )
    return { recipient, createdAt_gt }
  }, [memberId, lastSeenNotificationDates])

  const { data, fetchMore } = useGetNotificationsCountQuery({ variables: { where } })

  return useMemo(() => ({ data: data?.notificationsConnection.totalCount, fetchMore }), [data, fetchMore])
}

const useUnseenChannelNotifications = (
  lastSeenNotificationDates: NotificationsStoreState['lastSeenNotificationDates']
) => {
  const { activeMembership, channelId } = useUser()
  const client = useApolloClient()

  const [unseenByChannel, setUnseenByChannel] = useState<Map<string, number> | undefined>()

  const fetchAll = useCallback(async () => {
    if (!activeMembership) return

    const unseenByChannelPairs = await Promise.all(
      activeMembership.channels.map(async (channel): Promise<[string, number] | undefined> => {
        const recipient = { isTypeOf_eq: 'ChannelRecipient', channel: { id_eq: channel.id } }
        const createdAt_gt = whenDefined(
          lastSeenNotificationDates.find(({ type, id }) => type === 'ChannelRecipient' && id === channel.id),
          ({ date }) => new Date(date)
        )
        const { data } = await client.query<GetNotificationsCountQuery, GetNotificationsCountQueryVariables>({
          query: GetNotificationsCountDocument,
          variables: { where: { recipient, createdAt_gt } },
        })
        return data && [channel.id, data.notificationsConnection.totalCount]
      })
    )

    setUnseenByChannel(new Map(unseenByChannelPairs.filter((x): x is [string, number] => !!x)))
  }, [lastSeenNotificationDates, activeMembership, client])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  return useMemo(
    () => ({
      data: unseenByChannel && {
        channels: unseenByChannel,
        total: sum(Array.from(unseenByChannel.values() ?? [])),
        current: unseenByChannel.get(channelId ?? '') ?? 0,
      },
      fetchMore: fetchAll,
    }),
    [unseenByChannel, fetchAll, channelId]
  )
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
    case 'CreatorTokenRevenueSharePlanned':
    case 'CreatorTokenRevenueShareStarted':
    case 'CreatorTokenRevenueShareEnded':
    case 'CreatorTokenSaleStarted':
    case 'CreatorTokenMarketStarted':
    case 'CreatorTokenIssued':
    case 'CreatorTokenMarketMint':
    case 'CreatorTokenMarketBurn':
    case 'CreatorTokenSaleMint':
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
  return { ...rest, ...data, type: __typename as T['__typename'] } as unknown as R
}
