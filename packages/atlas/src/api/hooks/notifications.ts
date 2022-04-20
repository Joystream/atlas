import { QueryHookOptions } from '@apollo/client'
import { useMemo } from 'react'

import { GetNftNotificationsQuery, GetNftNotificationsQueryVariables, useGetNftNotificationsQuery } from '@/api/queries'

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

export const useRawActivities = (memberId?: string) => {
  const { data, ...rest } = useGetNftActivitiesQuery({
    variables: {
      limit: 100,
      memberId: memberId || '',
    },
  })
  const sortedActivities = useMemo(() => {
    const allNotifications = data
      ? [
          ...data.auctionBidMadeEventsConnection.edges.map((e) => e.node),
          ...data.purchaseNftBoughtEventsConnection.edges.map((e) => e.node),
          ...data.purchaseBidMadeCompletingAuctionEventsConnection.edges.map((e) => e.node),
          ...data.purchaseOpenAuctionBidAcceptedEventsConnection.edges.map((e) => e.node),
          ...data.englishAuctionStartedEventsConnection.edges.map((e) => e.node),
          ...data.openAuctionStartedEventsConnection.edges.map((e) => e.node),
          ...data.nftSellOrderMadeEventsConnection.edges.map((e) => e.node),
          ...data.auctionBidCanceledEventsConnection.edges.map((e) => e.node),
          ...data.buyNowCanceledEventsConnection.edges.map((e) => e.node),
          ...data.auctionCanceledEventsConnection.edges.map((e) => e.node),
          ...data.buyNowPriceUpdatedEventsConnection.edges.map((e) => e.node),
          ...data.nftIssuedEventsConnection.edges.map((e) => e.node),
        ]
      : []
    return allNotifications.sort((n1, n2) => n2.createdAt.getTime() - n1.createdAt.getTime())
  }, [data])

  return {
    activities: sortedActivities,
    ...rest,
  }
}
