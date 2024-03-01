import { FetchPolicy, NetworkStatus, QueryHookOptions } from '@apollo/client'

import { useBasicChannelsConnection } from '@/api/hooks/channelsConnection'
import { useBasicVideosConnection } from '@/api/hooks/videosConnection'
import { VideoOrderByInput, VideoWhereInput } from '@/api/queries/__generated__/baseTypes.generated'
import { useDebounceValue } from '@/hooks/useDebounceValue'
import { SentryLogger } from '@/utils/logs'

type SearchResultData = {
  searchQuery: string
  first?: number
  offset?: number
  videoWhereInput?: VideoWhereInput
  isReady?: boolean
  fetchPolicy?: FetchPolicy
}

export const useSearchResults = ({
  searchQuery,
  first = 50,
  videoWhereInput,
  isReady = true,
  fetchPolicy,
}: SearchResultData) => {
  const text = useDebounceValue(searchQuery, 500)

  const commonOptions: QueryHookOptions = {
    fetchPolicy,
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    skip: !text || !isReady,
  }

  const {
    edges: videosEdges = [],
    pageInfo: videosPageInfo,
    totalCount: videosTotalCount,
    loading: videosLoading,
    error: videosError,
    fetchMore: fetchMoreVideos,
    refetch: refetchVideos,
    networkStatus: videosNetworkStatus,
  } = useBasicVideosConnection(
    {
      first,
      where: {
        title_containsInsensitive: text,
        media: {
          isAccepted_eq: true,
        },
        thumbnailPhoto: {
          isAccepted_eq: true,
        },
        isPublic_eq: true,
        isCensored_eq: false,
        ...videoWhereInput,
      },
      orderBy: [VideoOrderByInput.VideoRelevanceDesc],
    },
    {
      ...commonOptions,
      skipCountQuery: true,
      onError: (error) => SentryLogger.error('Failed to fetch video search results', 'SearchResults', error),
    }
  )

  const {
    edges: channelsEdges = [],
    pageInfo: channelsPageInfo,
    totalCount: channelsTotalCount,
    loading: channelsLoading,
    error: channelsError,
    fetchMore: fetchMoreChannels,
    refetch: refetchChannels,
    networkStatus: channelsNetworkStatus,
  } = useBasicChannelsConnection(
    {
      first,
      where: {
        title_containsInsensitive: text,
        isPublic_eq: true,
      },
    },
    {
      ...commonOptions,
      onError: (error) => SentryLogger.error('Failed to fetch channel search results', 'SearchResults', error),
    }
  )

  return {
    channels: {
      items: channelsEdges.map((item) => item.node),
      pageInfo: channelsPageInfo,
      totalCount: channelsTotalCount,
      fetchMore: fetchMoreChannels,
      refetch: refetchVideos,
    },
    videos: {
      items: videosEdges.map((item) => item.node),
      pageInfo: videosPageInfo,
      totalCount: videosTotalCount,
      fetchMore: fetchMoreVideos,
      refetch: refetchChannels,
    },
    error: videosError || channelsError,
    loading:
      videosLoading ||
      channelsLoading ||
      videosNetworkStatus === NetworkStatus.fetchMore ||
      channelsNetworkStatus === NetworkStatus.fetchMore,
  }
}
