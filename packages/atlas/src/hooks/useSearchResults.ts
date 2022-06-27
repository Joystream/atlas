import { FetchPolicy, NetworkStatus } from '@apollo/client'
import { debounce } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'

import { useBasicChannelsConnection, useBasicVideosConnection } from '@/api/hooks'
import { VideoOrderByInput, VideoWhereInput } from '@/api/queries'
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
  const [text, setText] = useState(searchQuery)
  const [typing, setTyping] = useState(false)
  const debouncedQuery = useRef(
    debounce((query: string) => {
      setText(query)
      setTyping(false)
    }, 500)
  )

  useEffect(() => {
    if (searchQuery.length) {
      setTyping(true)
      debouncedQuery.current(searchQuery)
    }
  }, [searchQuery])

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
        title_contains: text,
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
      orderBy: [
        VideoOrderByInput.ReactionsCountDesc,
        VideoOrderByInput.CommentsCountDesc,
        VideoOrderByInput.CreatedAtDesc,
      ],
    },
    {
      fetchPolicy,
      notifyOnNetworkStatusChange: true,
      skip: !text || !isReady,
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
        title_contains: text,
        avatarPhoto: {
          isAccepted_eq: true,
        },
      },
    },
    {
      fetchPolicy,
      notifyOnNetworkStatusChange: true,
      skip: !text || !isReady,
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
      typing ||
      videosNetworkStatus === NetworkStatus.fetchMore ||
      channelsNetworkStatus === NetworkStatus.fetchMore,
  }
}
