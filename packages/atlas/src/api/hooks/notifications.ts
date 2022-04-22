import { QueryHookOptions } from '@apollo/client'
import { useMemo } from 'react'

import {
  GetNftActivitiesQuery,
  GetNftNotificationsQuery,
  GetNftNotificationsQueryVariables,
  useGetNftActivitiesQuery,
  useGetNftNotificationsQuery,
} from '@/api/queries'

export const useRawNotifications = (
  memberId: string | null,
  opts?: QueryHookOptions<GetNftNotificationsQuery, GetNftNotificationsQueryVariables>
) => {
  const { data, ...rest } = useGetNftNotificationsQuery({
    variables: {
      limit: 1000,
      memberId: memberId || '',
    },
    skip: !memberId,
    ...opts,
  })

  const sortedNotifications = useMemo(() => {
    const allNotifications = data
      ? [
          ...data.openAuctionBidAcceptedEvents,
          ...data.bidMadeCompletingAuctionEvents,
          ...data.nftBoughtEvents,
          ...data.auctionBidMadeEvents,
        ]
      : []

    return allNotifications.sort((n1, n2) => n2.createdAt.getTime() - n1.createdAt.getTime())
  }, [data])

  return {
    notifications: sortedNotifications,
    ...rest,
  }
}

export const createAllNotificationArray = (data: GetNftActivitiesQuery) => {
  return [
    ...data.auctionBidMadeEventsConnection.edges.map((e) => e.node),
    ...data.purchaseNftBoughtEventsConnection.edges.map((e) => e.node),
    ...data.purchaseBidMadeCompletingAuctionEventsConnection.edges.map((e) => e.node),
    ...data.purchaseOpenAuctionBidAcceptedEventsConnection.edges.map((e) => e.node),
    ...data.saleNftBoughtEventsConnection.edges.map((e) => e.node),
    ...data.saleBidMadeCompletingAuctionEventsConnection.edges.map((e) => e.node),
    ...data.saleOpenAuctionBidAcceptedEventsConnection.edges.map((e) => e.node),
    ...data.englishAuctionStartedEventsConnection.edges.map((e) => e.node),
    ...data.openAuctionStartedEventsConnection.edges.map((e) => e.node),
    ...data.nftSellOrderMadeEventsConnection.edges.map((e) => e.node),
    ...data.auctionBidCanceledEventsConnection.edges.map((e) => e.node),
    ...data.buyNowCanceledEventsConnection.edges.map((e) => e.node),
    ...data.auctionCanceledEventsConnection.edges.map((e) => e.node),
    ...data.buyNowPriceUpdatedEventsConnection.edges.map((e) => e.node),
    ...data.nftIssuedEventsConnection.edges.map((e) => e.node),
  ]
}

export const useRawActivities = (memberId?: string, sort?: 'createdAt_ASC' | 'createdAt_DESC') => {
  const { data, ...rest } = useGetNftActivitiesQuery({
    variables: {
      limit: 100,
      memberId: memberId || '',
    },
    skip: !memberId,
  })

  const sortedActivities = useMemo(() => {
    return data
      ? createAllNotificationArray(data).sort((n1, n2) =>
          sort === 'createdAt_DESC'
            ? n2.createdAt.getTime() - n1.createdAt.getTime()
            : n1.createdAt.getTime() - n2.createdAt.getTime()
        )
      : undefined
  }, [data, sort])

  return {
    activities: sortedActivities,
    rawData: data,
    ...rest,
  }
}
