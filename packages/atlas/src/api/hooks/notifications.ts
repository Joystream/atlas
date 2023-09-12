import { QueryHookOptions } from '@apollo/client'

import {
  GetNftActivitiesCountQuery,
  GetNftActivitiesCountQueryVariables,
  GetNftActivitiesQuery,
  GetNftActivitiesQueryVariables,
  useGetChannelNotificationsConnectionQuery,
  useGetMembershipNotificationsConnectionQuery,
  useGetNftActivitiesCountQuery,
  useGetNftActivitiesQuery,
  useMarkNotificationsAsReadMutation,
} from '@/api/queries/__generated__/notifications.generated'
import { UseNotificationsOptions } from '@/providers/notifications/notifications.hooks'

import { NftActivityOrderByInput } from '../queries/__generated__/baseTypes.generated'

export const useRawNotifications = (accountId: string, options?: UseNotificationsOptions) => {
  const { type = 'membership', ...opts } = options ?? {}

  const membershipNotifications = useGetMembershipNotificationsConnectionQuery({
    variables: { first: 10, accountId },
    skip: !accountId || type !== 'membership',
    ...opts,
  })
  const channelNotifications = useGetChannelNotificationsConnectionQuery({
    variables: { first: 10, accountId },
    skip: !accountId || type !== 'channel',
    ...opts,
  })

  const [markNotificationsAsReadMutation] = useMarkNotificationsAsReadMutation()

  const { data, ...rest } = membershipNotifications ?? channelNotifications

  return {
    notifications: data?.notificationInAppDeliveriesConnection.edges || [],
    totalCount: data?.notificationInAppDeliveriesConnection.totalCount,
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
