import { QueryHookOptions } from '@apollo/client'

import {
  GetBasicVideosConnectionQuery,
  GetBasicVideosConnectionQueryVariables,
  GetFullVideosConnectionQuery,
  GetFullVideosConnectionQueryVariables,
  useGetBasicVideosConnectionQuery,
  useGetFullVideosConnectionQuery,
  useGetVideosCountQuery,
} from '@/api/queries/__generated__/videos.generated'

type UseBasicVideosConnectionOptions = {
  skipCountQuery?: boolean
} & QueryHookOptions<GetBasicVideosConnectionQuery>

export const useBasicVideosConnection = (
  variables?: GetBasicVideosConnectionQueryVariables,
  opts?: UseBasicVideosConnectionOptions
) => {
  const { data: countData } = useGetVideosCountQuery({
    variables: {
      where: variables?.where,
    },
    skip: opts?.skipCountQuery,
  })
  const { data, ...rest } = useGetBasicVideosConnectionQuery({
    ...opts,
    variables,
  })

  return {
    videosConnection: data?.videosConnection,
    edges: data?.videosConnection.edges,
    totalCount: countData?.videosConnection.totalCount,
    pageInfo: data?.videosConnection.pageInfo,
    ...rest,
  }
}

export const useFullVideosConnection = (
  variables?: GetFullVideosConnectionQueryVariables,
  opts?: QueryHookOptions<GetFullVideosConnectionQuery>
) => {
  const { data: countData } = useGetVideosCountQuery({
    variables: {
      where: variables?.where,
    },
  })
  const { data, ...rest } = useGetFullVideosConnectionQuery({
    ...opts,
    variables,
  })

  return {
    videosConnection: data?.videosConnection,
    edges: data?.videosConnection.edges,
    totalCount: countData?.videosConnection.totalCount,
    pageInfo: data?.videosConnection.pageInfo,
    ...rest,
  }
}
