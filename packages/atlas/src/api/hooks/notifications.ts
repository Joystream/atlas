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
          ...data.englishAuctionSettledEvents,
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
  return Object.values(data).flatMap((d) => {
    if (d !== 'Query') {
      return d.edges.map((e) => e.node)
    } else {
      return []
    }
  })
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
