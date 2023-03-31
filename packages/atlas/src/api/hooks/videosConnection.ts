import { QueryHookOptions } from '@apollo/client'

import {
  GetBasicVideosConnectionQuery,
  GetBasicVideosConnectionQueryVariables,
  GetFullVideosConnectionQuery,
  GetFullVideosConnectionQueryVariables,
  useGetBasicVideosConnectionQuery,
  useGetFullVideosConnectionQuery,
} from '@/api/queries/__generated__/videos.generated'
import { createVideoWhereObjectWithFilters } from '@/config/contentFilter'

export const useBasicVideosConnection = (
  variables?: GetBasicVideosConnectionQueryVariables,
  opts?: QueryHookOptions<GetBasicVideosConnectionQuery>
) => {
  const { data, ...rest } = useGetBasicVideosConnectionQuery({
    ...opts,
    variables: { ...variables, where: createVideoWhereObjectWithFilters(variables?.where) },
  })

  return {
    videosConnection: data?.videosConnection,
    edges: data?.videosConnection.edges,
    totalCount: data?.videosConnection.totalCount,
    pageInfo: data?.videosConnection.pageInfo,
    ...rest,
  }
}

export const useFullVideosConnection = (
  variables?: GetFullVideosConnectionQueryVariables,
  opts?: QueryHookOptions<GetFullVideosConnectionQuery>
) => {
  const { data, ...rest } = useGetFullVideosConnectionQuery({
    ...opts,
    variables: { ...variables, where: createVideoWhereObjectWithFilters(variables?.where) },
  })

  return {
    videosConnection: data?.videosConnection,
    edges: data?.videosConnection.edges,
    totalCount: data?.videosConnection.totalCount,
    pageInfo: data?.videosConnection.pageInfo,
    ...rest,
  }
}
