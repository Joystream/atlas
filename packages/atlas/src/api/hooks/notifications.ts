import { QueryHookOptions } from '@apollo/client'
import { useRef } from 'react'

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
import { useJoystreamStore } from '@/providers/joystream/joystream.store'

import { NftActivityOrderByInput, RecipientTypeWhereInput } from '../queries/__generated__/baseTypes.generated'

export const useRawNotifications = (
  recipient: RecipientTypeWhereInput | undefined,
  opts?: Pick<QueryHookOptions, 'notifyOnNetworkStatusChange'>
) => {
  const currentBlockRef = useRef(useJoystreamStore((store) => store.currentBlock))
  const { data, ...rest } = useGetNotificationsConnectionQuery({
    variables: {
      first: 10,
      recipient: recipient as RecipientTypeWhereInput,
      dispatchBlock: currentBlockRef.current ?? 0,
    },
    ...opts,
    skip: !recipient,
  })

  const [markNotificationsAsReadMutation] = useMarkNotificationsAsReadMutation()

  return {
    notifications: data?.notificationsConnection.edges || [],
    pageInfo: data?.notificationsConnection.pageInfo,
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
