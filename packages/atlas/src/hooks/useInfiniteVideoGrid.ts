import { QueryHookOptions, useQuery as useApolloQuery } from '@apollo/client'
import { DocumentNode } from 'graphql'

import {
  GetBasicVideosConnectionQuery,
  GetBasicVideosConnectionQueryVariables,
  GetHomepageVideosQuery,
  GetHomepageVideosQueryVariables,
} from '@/api/queries/__generated__/videos.generated'
import { DEFAULT_VIDEO_GRID } from '@/styles'
import { createPlaceholderData } from '@/utils/data'

import { useBreakpointKey } from './useBreakpointKey'
import { useVideoGridRows } from './useVideoGridRows'

type VideoInfiniteQueries = GetBasicVideosConnectionQuery | GetHomepageVideosQuery

type useGridTilesOpts<Query extends VideoInfiniteQueries> = {
  query: DocumentNode
  variables: Query extends GetBasicVideosConnectionQuery
    ? GetBasicVideosConnectionQueryVariables
    : GetHomepageVideosQueryVariables
  options?: Omit<QueryHookOptions, 'variables'>
}

export const useInfiniteVideoGrid = <Query extends VideoInfiniteQueries>({
  query,
  variables,
  options,
}: useGridTilesOpts<Query>) => {
  const initialRowsToLoad = useVideoGridRows('main')

  const breakPointKey = useBreakpointKey()
  const columns = (breakPointKey && DEFAULT_VIDEO_GRID[breakPointKey]?.columns) ?? 0

  const { data, loading, fetchMore } = useApolloQuery<Query>(query, {
    ...options,
    notifyOnNetworkStatusChange: true,
    skip: !columns,
    variables: {
      ...variables,
      limit: columns * initialRowsToLoad,
      first: columns * initialRowsToLoad,
    },
  })

  const dataConnection = data && ('homepageVideos' in data ? data.homepageVideos : data.videosConnection)

  const firstLoad = !dataConnection && loading
  const firstLoadPlaceholders = firstLoad ? createPlaceholderData(columns * initialRowsToLoad) : []
  const displayedItems = dataConnection
    ? 'edges' in dataConnection
      ? dataConnection.edges.map((edge) => edge.node)
      : dataConnection?.video
    : []

  const nextLoadPlaceholders = dataConnection
    ? 'pageInfo' in dataConnection
      ? dataConnection.pageInfo.hasNextPage
        ? createPlaceholderData(columns * 4)
        : []
      : createPlaceholderData(columns * 4)
    : []

  return {
    tiles: [...firstLoadPlaceholders, ...displayedItems, ...(loading ? nextLoadPlaceholders : [])],
    fetchMore,
    rawData: data as Query,
    pageInfo: dataConnection ? ('pageInfo' in dataConnection ? dataConnection?.pageInfo : undefined) : undefined,
    columns,
    loading,
  }
}
