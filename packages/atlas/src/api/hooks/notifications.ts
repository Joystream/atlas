import { QueryHookOptions } from '@apollo/client'

import {
  GetNftActivitiesCountQuery,
  GetNftActivitiesCountQueryVariables,
  GetNftActivitiesQuery,
  GetNftActivitiesQueryVariables,
  useGetNftActivitiesCountQuery,
  useGetNftActivitiesQuery,
  useGetNotificationsConnectionQuery,
  useMarkNotificationsAsReadMutation,
} from '@/api/queries/__generated__/notifications.generated'
import { RecipientType } from '@/providers/notifications/notifications.store'

import { NftActivityOrderByInput } from '../queries/__generated__/baseTypes.generated'

export const useRawNotifications = (
  accountId: string,
  type: RecipientType,
  opts?: Pick<QueryHookOptions, 'notifyOnNetworkStatusChange'>
) => {
  const { data, ...rest } = useGetNotificationsConnectionQuery({
    variables: { first: 10, accountId, type },
    ...opts,
  })

  const [markNotificationsAsReadMutation] = useMarkNotificationsAsReadMutation()

  return {
    notifications: data?.notificationInAppDeliveriesConnection.edges || [],
    pageInfo: data?.notificationInAppDeliveriesConnection.pageInfo,
    markNotificationsAsReadMutation,
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
