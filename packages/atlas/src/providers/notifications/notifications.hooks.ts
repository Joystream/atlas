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
import { useNetworkUtils } from '@/providers/networkUtils/networkUtils.hooks'
import { NetworkUtilsContextValue } from '@/providers/networkUtils/networkUtils.type'
import { useUser } from '@/providers/user/user.hooks'
import { whenDefined } from '@/utils/misc'

import { NotificationsStoreState, RecipientType, useNotificationStore } from './notifications.store'
import { NotificationData, NotificationRecord, NotificationRefetchActionType } from './notifications.types'

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

const refetchedNotifications = new Map<string, number>()

export const useNotifications = (opts?: Pick<QueryHookOptions, 'notifyOnNetworkStatusChange'>): UseNotifications => {
  const { pathname } = useLocation()
  const isStudio = pathname.search(absoluteRoutes.studio.index()) !== -1
  const { channelId, memberId } = useUser()
  const networkUtils = useNetworkUtils()

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
      rawNotifications.map(({ node: { id, createdAt, status, notificationType } }): NotificationRecord => {
        const notificationData = parseNotificationType(notificationType as NotificationType)
        if (notificationData.refetchAction && !refetchedNotifications.has(id)) {
          const refetchFn = networkUtils[notificationData.refetchAction.name]
          refetchedNotifications.set(id, 1)
          refetchFn(...(notificationData.refetchAction.args as Parameters<typeof refetchFn>))
        }
        return {
          id,
          date: new Date(createdAt),
          read: status.__typename === 'Read' || optimisticRead.includes(id),
          ...notificationData,
        }
      }),
    [rawNotifications, optimisticRead, networkUtils]
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
      return toNotificationData(
        notificationType,
        { price: new BN(notificationType.price) },
        {
          name: 'refetchNftData',
          args: [notificationType.videoId],
        }
      )

    case 'AuctionWon':
    case 'AuctionLost':
      return toNotificationData(
        notificationType,
        { auction: notificationType.type.__typename },
        {
          name: 'refetchNftData',
          args: [notificationType.videoId],
        }
      )

    case 'VideoLiked':
    case 'VideoDisliked':
      return toNotificationData(
        notificationType,
        {},
        {
          name: 'refetchVideo',
          args: [notificationType.videoId],
        }
      )
    case 'CommentPostedToVideo':
      return toNotificationData(
        notificationType,
        {},
        {
          name: 'refetchAllCommentsSections',
          args: [],
        }
      )
    case 'CommentReply':
    case 'ReactionToComment':
      return toNotificationData(notificationType, {} as never, {
        name: 'refetchComment',
        args: [notificationType.commentId],
      })
    case 'HigherBidPlaced':
    case 'NewNftOnSale':
    case 'NewAuction':
      return toNotificationData(notificationType, {} as never, {
        name: 'refetchNftData',
        args: [notificationType.videoId],
      })

    case 'ChannelExcluded':
    case 'VideoExcluded':
    case 'NftFeaturedOnMarketPlace':
    case 'NewChannelFollower':
    case 'ChannelVerified':
    case 'ChannelSuspended':
    case 'ChannelCreated':
    case 'VideoPosted':
      return toNotificationData(notificationType, {})
    case 'CreatorTokenRevenueSharePlanned':
    case 'CreatorTokenRevenueShareStarted':
    case 'CreatorTokenRevenueShareEnded':
    case 'CreatorTokenSaleStarted':
    case 'CreatorTokenMarketStarted':
    case 'CreatorTokenIssued':
    case 'CreatorTokenMarketMint':
    case 'CreatorTokenMarketBurn':
    case 'CreatorTokenSaleMint':
      return toNotificationData(
        notificationType,
        {},
        {
          name: 'refetchCreatorTokenData',
          // todo add tokenId to orion notification event
          args: ['1'],
        }
      )
  }
}

type TypenameOf<T> = T extends { __typename: infer Typename } ? Typename : never
type NotifDataOfType<T> = NotificationData extends infer D ? (D extends { type: T } ? D : never) : never

const toNotificationData = <
  T extends NotificationType,
  R extends NotifDataOfType<TypenameOf<T>>,
  U extends keyof NetworkUtilsContextValue
>(
  notificationType: T,
  data: Partial<R>,
  refetchAction?: NotificationRefetchActionType<U>
) => {
  const { __typename, ...rest } = notificationType
  return { ...rest, ...data, type: __typename as T['__typename'], refetchAction } as unknown as R
}
