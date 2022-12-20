import { QueryHookOptions } from '@apollo/client'

import {
  GetNftActivitiesQuery,
  GetNotificationsQuery,
  GetNotificationsQueryVariables,
  useGetNftActivitiesQuery,
  useGetNotificationsQuery,
} from '@/api/queries/__generated__/notifications.generated'

import { EventOrderByInput } from '../queries/__generated__/baseTypes.generated'

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
// todo replace createdAt with timestamp
export const useRawActivities = (memberId?: string, sort: 'createdAt_ASC' | 'createdAt_DESC' = 'createdAt_DESC') => {
  const { data, ...rest } = useGetNftActivitiesQuery({
    variables: {
      limit: 100,
      orderBy: sort === 'createdAt_DESC' ? [EventOrderByInput.TimestampDesc] : [EventOrderByInput.TimestampAsc],
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
