import { QueryHookOptions } from '@apollo/client'

import {
  GetNftActivitiesCountQuery,
  GetNftActivitiesCountQueryVariables,
  GetNftActivitiesQuery,
  GetNftActivitiesQueryVariables,
  GetNotificationsConnectionQuery,
  GetNotificationsConnectionQueryVariables,
  useGetNftActivitiesCountQuery,
  useGetNftActivitiesQuery,
  useGetNotificationsConnectionQuery,
} from '@/api/queries/__generated__/notifications.generated'

import { NftActivityOrderByInput } from '../queries/__generated__/baseTypes.generated'

export const useRawNotifications = (
  memberId: string | null,
  opts?: QueryHookOptions<GetNotificationsConnectionQuery, GetNotificationsConnectionQueryVariables>
) => {
  const { data, ...rest } = useGetNotificationsConnectionQuery({
    variables: {
      first: 10,
      memberId: memberId || '',
    },
    skip: !memberId,
    ...opts,
  })
  return {
    notifications: data?.notificationsConnection.edges || [],
    totalCount: data?.notificationsConnection.totalCount,
    pageInfo: data?.notificationsConnection.pageInfo,
    ...rest,
  }
}

export const useActivitiesCount = (
  memberId?: string,
  opts?: QueryHookOptions<GetNftActivitiesCountQuery, GetNftActivitiesCountQueryVariables>
) => {
  const { data, ...rest } = useGetNftActivitiesCountQuery({
    ...opts,
    variables: {
      memberId: memberId || '',
    },
    skip: !memberId,
  })

  return {
    nftsBiddedTotalCount: data?.nftsBidded.totalCount,
    nftsBoughtTotalCount: data?.nftsBought.totalCount,
    nftsSoldTotalCount: data?.nftsSold.totalCount,
    nftsIssuedTotalCount: data?.nftsIssued.totalCount,
    ...rest,
  }
}

export const useRawActivities = (
  memberId?: string,
  sort: NftActivityOrderByInput = NftActivityOrderByInput.EventTimestampDesc,
  opts?: QueryHookOptions<GetNftActivitiesQuery, GetNftActivitiesQueryVariables>
) => {
  const { data, ...rest } = useGetNftActivitiesQuery({
    ...opts,
    variables: {
      first: 10,
      orderBy: sort,
      memberId: memberId || '',
    },
    skip: !memberId,
  })

  return {
    totalCount: data?.nftActivitiesConnection.totalCount,
    pageInfo: data?.nftActivitiesConnection.pageInfo,
    activities: data?.nftActivitiesConnection.edges,
    ...rest,
  }
}
