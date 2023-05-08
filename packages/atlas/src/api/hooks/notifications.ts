import { QueryHookOptions } from '@apollo/client'

import {
  GetNotificationsQuery,
  GetNotificationsQueryVariables,
  useGetNftActivitiesQuery,
  useGetNotificationsQuery,
} from '@/api/queries/__generated__/notifications.generated'

import { NftActivityOrderByInput } from '../queries/__generated__/baseTypes.generated'

export const useRawNotifications = (
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
    notifications: data?.notifications || [],
    ...rest,
  }
}

export const useRawActivities = (
  memberId?: string,
  sort: NftActivityOrderByInput = NftActivityOrderByInput.EventTimestampDesc
) => {
  const { data, ...rest } = useGetNftActivitiesQuery({
    variables: {
      first: 10,
      orderBy: sort,
      memberId: memberId || '',
    },
    skip: !memberId,
  })

  return {
    nftsBiddedTotalCount: data?.nftsBidded.totalCount,
    nftsBoughtTotalCount: data?.nftsBought.totalCount,
    nftsSoldTotalCount: data?.nftsSold.totalCount,
    nftsIssuedTotalCount: data?.nftsIssued.totalCount,
    totalCount: data?.nftActivitiesConnection.totalCount,
    pageInfo: data?.nftActivitiesConnection.pageInfo,
    activities: data?.nftActivitiesConnection.edges,
    ...rest,
  }
}
