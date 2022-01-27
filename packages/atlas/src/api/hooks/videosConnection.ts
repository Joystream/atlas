import { QueryHookOptions } from '@apollo/client'

import { GetVideosConnectionQuery, GetVideosConnectionQueryVariables, useGetVideosConnectionQuery } from '@/api/queries'

export const useVideosConnection = (
  variables?: GetVideosConnectionQueryVariables,
  opts?: QueryHookOptions<GetVideosConnectionQuery>
) => {
  const { data, ...rest } = useGetVideosConnectionQuery({ ...opts, variables })

  return {
    videosConnection: data?.videosConnection,
    edges: data?.videosConnection.edges,
    totalCount: data?.videosConnection.totalCount,
    pageInfo: data?.videosConnection.pageInfo,
    ...rest,
  }
}
