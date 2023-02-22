import { QueryHookOptions } from '@apollo/client'

import {
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
      memberId: memberId || '',
    },
    // TODO Fix me. We use `no-cache` because for unknown reasons cache removes data about owner
    fetchPolicy: 'no-cache',
    skip: !memberId,
    ...opts,
  })

  return {
    notifications: data?.events || [],
    ...rest,
  }
}

export const useRawActivities = (memberId?: string, sort: EventOrderByInput = EventOrderByInput.TimestampDesc) => {
  const { data, ...rest } = useGetNftActivitiesQuery({
    variables: {
      limit: 100,
      orderBy: [sort],
      memberId: memberId || '',
    },
    // TODO Fix me. We use `no-cache` because for unknown reasons cache removes data about owner
    fetchPolicy: 'no-cache',
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
