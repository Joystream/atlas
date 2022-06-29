import { QueryHookOptions } from '@apollo/client'

import {
  GetBasicChannelsConnectionQuery,
  GetBasicChannelsConnectionQueryVariables,
  useGetBasicChannelsConnectionQuery,
} from '@/api/queries'

export const useBasicChannelsConnection = (
  variables?: GetBasicChannelsConnectionQueryVariables,
  opts?: QueryHookOptions<GetBasicChannelsConnectionQuery, GetBasicChannelsConnectionQueryVariables>
) => {
  const { data, ...rest } = useGetBasicChannelsConnectionQuery({
    ...opts,
    variables: {
      ...variables,
      where: {
        isCensored_eq: false,
        isPublic_eq: true,
        ...variables?.where,
      },
    },
  })

  return {
    channelsConnection: data?.channelsConnection,
    edges: data?.channelsConnection.edges,
    totalCount: data?.channelsConnection.totalCount,
    pageInfo: data?.channelsConnection.pageInfo,
    ...rest,
  }
}
