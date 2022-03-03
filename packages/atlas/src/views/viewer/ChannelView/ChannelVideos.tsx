import { ApolloError } from '@apollo/client'
import React, { useEffect, useState } from 'react'

import { useVideosConnection } from '@/api/hooks'
import { VideoFieldsFragment, VideoOrderByInput } from '@/api/queries'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Grid } from '@/components/Grid'
import { Pagination } from '@/components/Pagination'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'
import { transitions } from '@/styles'
import { SentryLogger } from '@/utils/logs'

import { usePagination } from './ChannelView.hooks'
import { PaginationContainer, VideoSection } from './ChannelView.styles'

import { INITIAL_FIRST, INITIAL_VIDEOS_PER_ROW } from '.'

type ChannelVideosProps = {
  isSearching?: boolean
  searchedText?: string
  channelId: string
  foundVideos?: VideoFieldsFragment[]
  loadingSearch?: boolean
  searchError?: ApolloError
  channelError?: ApolloError
  sortVideosBy?: VideoOrderByInput
}

export const ChannelVideos: React.FC<ChannelVideosProps> = ({
  isSearching,
  searchedText,
  channelId,
  foundVideos,
  loadingSearch,
  searchError,
  channelError,
  sortVideosBy,
}) => {
  const { currentPage, setCurrentPage, currentSearchPage, setCurrentSearchPage } = usePagination(0)
  const videoRows = useVideoGridRows('main')

  const {
    edges,
    totalCount,
    loading: loadingVideos,
    error: videosError,
    fetchMore,
    refetch,
    variables,
    pageInfo,
  } = useVideosConnection(
    {
      first: INITIAL_FIRST,
      orderBy: sortVideosBy,
      where: {
        channel: {
          id_eq: channelId,
        },
        isPublic_eq: true,
        isCensored_eq: false,
        thumbnailPhoto: {
          isAccepted_eq: true,
        },
        media: {
          isAccepted_eq: true,
        },
      },
    },
    {
      notifyOnNetworkStatusChange: true,
      onError: (error) =>
        SentryLogger.error('Failed to fetch videos', 'ChannelView', error, { channel: { channelId } }),
    }
  )

  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)

  // set page to 0 when sortVideosBy changed
  useEffect(() => {
    setCurrentPage(0)
    refetch()
  }, [refetch, setCurrentPage, sortVideosBy])

  const handleOnResizeGrid = (sizes: number[]) => setVideosPerRow(sizes.length)
  const handleChangePage = (page: number) => {
    if (isSearching) {
      setCurrentSearchPage(page)
    } else {
      setCurrentPage(page)
      if (!!edges && page * videosPerPage + videosPerPage > edges?.length && edges?.length < (totalCount ?? 0)) {
        fetchMore({
          variables: {
            ...variables,
            first: page * videosPerPage + videosPerPage * 3 - edges.length,
            after: pageInfo?.endCursor,
          },
        })
      }
    }
  }

  const videosPerPage = videoRows * videosPerRow

  const videos = (isSearching ? foundVideos : edges?.map((edge) => edge.node)) ?? []
  const paginatedVideos = isSearching
    ? videos.slice(currentSearchPage * videosPerPage, currentSearchPage * videosPerPage + videosPerPage)
    : videos.slice(currentPage * videosPerPage, currentPage * videosPerPage + videosPerPage)

  const placeholderItems = Array.from(
    { length: loadingVideos || loadingSearch ? videosPerPage - (paginatedVideos ? paginatedVideos.length : 0) : 0 },
    () => ({
      id: undefined,
    })
  )

  if (videosError || channelError || searchError) {
    return <ViewErrorFallback />
  }

  const videosWithPlaceholders = [...(paginatedVideos || []), ...placeholderItems]
  return (
    <>
      <VideoSection className={transitions.names.slide}>
        {!videosWithPlaceholders.length && isSearching && (
          <EmptyFallback title={`No videos matching "${searchedText}" query found`} variant="small" />
        )}
        {!videosWithPlaceholders.length && !isSearching && (
          <EmptyFallback title="No videos on this channel" variant="small" />
        )}
        <Grid maxColumns={null} onResize={handleOnResizeGrid}>
          {videosWithPlaceholders.map((video, idx) => (
            <VideoTileViewer key={idx} id={video.id} detailsVariant="withoutChannel" />
          ))}
        </Grid>
      </VideoSection>
      <PaginationContainer>
        <Pagination
          onChangePage={handleChangePage}
          page={isSearching ? currentSearchPage : currentPage}
          itemsPerPage={videosPerPage}
          totalCount={isSearching ? foundVideos?.length : totalCount}
          maxPaginationLinks={7}
        />
      </PaginationContainer>
    </>
  )
}
