import { QueryHookOptions } from '@apollo/client'

import {
  GetBasicVideosConnectionQuery,
  GetBasicVideosConnectionQueryVariables,
  GetFullVideosConnectionQuery,
  GetFullVideosConnectionQueryVariables,
  useGetBasicVideosConnectionQuery,
  useGetFullVideosConnectionQuery,
} from '@/api/queries'
import { videoFilter } from '@/config/videoFilter'

export const useBasicVideosConnection = (
  variables?: GetBasicVideosConnectionQueryVariables,
  opts?: QueryHookOptions<GetBasicVideosConnectionQuery>
) => {
  const { data, ...rest } = useGetBasicVideosConnectionQuery({
    ...opts,
    variables: { ...variables, where: { ...videoFilter, ...variables?.where } },
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
    variables: { ...variables, where: { ...videoFilter, ...variables?.where } },
  })

  return {
    videosConnection: data?.videosConnection,
    edges: data?.videosConnection.edges,
    totalCount: data?.videosConnection.totalCount,
    pageInfo: data?.videosConnection.pageInfo,
    ...rest,
  }
}
