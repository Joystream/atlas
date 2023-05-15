import { QueryHookOptions, useQuery as useApolloQuery } from '@apollo/client'
import { DocumentNode } from 'graphql'

import {
  GetBasicVideosConnectionQuery,
  GetBasicVideosConnectionQueryVariables,
  GetMostViewedVideosConnectionQuery,
  GetMostViewedVideosConnectionQueryVariables,
  GetTilesVideosConnectionQuery,
  GetTilesVideosConnectionQueryVariables,
} from '@/api/queries/__generated__/videos.generated'
import { DEFAULT_VIDEO_GRID } from '@/styles'
import { createPlaceholderData } from '@/utils/data'

import { useBreakpointKey } from './useBreakpointKey'
import { useVideoGridRows } from './useVideoGridRows'

type VideoInfiniteQueries =
  | GetBasicVideosConnectionQuery
  | GetMostViewedVideosConnectionQuery
  | GetTilesVideosConnectionQuery

type useGridTilesOpts<Query extends VideoInfiniteQueries> = {
  query: DocumentNode
  variables: Query extends GetBasicVideosConnectionQuery
    ? GetBasicVideosConnectionQueryVariables
    : Query extends GetMostViewedVideosConnectionQuery
    ? GetMostViewedVideosConnectionQueryVariables
    : GetTilesVideosConnectionQueryVariables
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
    skip: !columns,
    variables: {
      ...variables,
      first: columns * initialRowsToLoad,
    },
  })
  const dataConnection =
    data && ('mostViewedVideosConnection' in data ? data.mostViewedVideosConnection : data.videosConnection)

  const firstLoad = !dataConnection?.edges && loading
  const firstLoadPlaceholders = firstLoad ? createPlaceholderData(columns * initialRowsToLoad) : []

  const displayedItems = dataConnection?.edges.map((edge) => edge.node) || []
  const itemsLeft = (dataConnection?.totalCount || 0) - (dataConnection?.edges?.length || 0)
  const itemsToLoad = Math.min(itemsLeft, columns * 4)

  const nextLoadPlaceholders = !dataConnection?.pageInfo.hasNextPage || false ? [] : createPlaceholderData(itemsToLoad)
  return {
    tiles: [...firstLoadPlaceholders, ...displayedItems, ...nextLoadPlaceholders],
    fetchMore,
    pageInfo: dataConnection?.pageInfo,
    columns,
  }
}
