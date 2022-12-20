import { QueryHookOptions } from '@apollo/client'

import {
  GetNftActivitiesQuery,
  GetNotificationsQuery,
  GetNotificationsQueryVariables,
  useGetNftActivitiesQuery,
  useGetNotificationsQuery,
} from '@/api/queries/__generated__/notifications.generated'

export const useRawNotifications = (
  channelId: string | null,
  memberId: string | null,
  opts?: QueryHookOptions<GetNotificationsQuery, GetNotificationsQueryVariables>
) => {
  const { data, ...rest } = useGetNotificationsQuery({
    variables: {
      limit: 1000,
      channelId: channelId || '',
      memberId: memberId || '',
    },
    skip: !memberId,
    ...opts,
  })

  return {
    notifications: data?.events || [],
    ...rest,
  }
}

export const createAllNotificationArray = (data: GetNftActivitiesQuery) => {
  return data.events
}

export const useRawActivities = (memberId?: string, sort?: 'createdAt_ASC' | 'createdAt_DESC') => {
  const { data, ...rest } = useGetNftActivitiesQuery({
    variables: {
      limit: 100,
      memberId: memberId || '',
    },
    skip: !memberId,
  })

  return {
    nftsBiddedTotalCount: data?.nftsBidded.totalCount,
    nftsBoughtTotalCount: data?.nftsBought.totalCount,
    nftsSoldTotalCount: data?.nftsSold.totalCount,
    nftsIssuedTotalCount: data?.nftsIssued.totalCount,
    nftsBidded: data?.nftsBidded,
    activities: data?.events,
    ...rest,
  }
}
