import { FC, useEffect } from 'react'

import { useBasicVideosConnection } from '@/api/hooks/videosConnection'
import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { BasicVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Grid } from '@/components/Grid'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { transitions } from '@/styles'
import { createPlaceholderData } from '@/utils/data'
import { SentryLogger } from '@/utils/logs'

import { StyledPagination, VideoSection } from './ChannelViewTabs.styles'

import { usePagination } from '../ChannelView.hooks'

type ChannelVideosProps = {
  isSearching?: boolean
  searchedText?: string
  channelId: string
  foundVideos?: BasicVideoFieldsFragment[]
  loadingSearch?: boolean
  sortVideosBy?: VideoOrderByInput
  tilesPerPage: number
  onResize: (sizes: number[]) => void
}

export const ChannelVideos: FC<ChannelVideosProps> = ({
  isSearching,
  searchedText,
  channelId,
  foundVideos,
  loadingSearch,
  sortVideosBy,
  tilesPerPage,
  onResize,
}) => {
  const { currentPage, setCurrentPage, currentSearchPage, setCurrentSearchPage } = usePagination(0)

  const {
    edges,
    totalCount,
    loading: loadingVideos,
    error: videosError,
    fetchMore,
    refetch,
    variables,
    pageInfo,
  } = useBasicVideosConnection(
    {
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

  // set page to 0 when sortVideosBy changed
  useEffect(() => {
    setCurrentPage(0)
    refetch()
  }, [refetch, setCurrentPage, sortVideosBy])

  const handleChangePage = (page: number) => {
    if (isSearching) {
      setCurrentSearchPage(page)
    } else {
      setCurrentPage(page)
      if (!!edges && page * tilesPerPage + tilesPerPage > edges?.length && edges?.length < (totalCount ?? 0)) {
        fetchMore({
          variables: {
            ...variables,
            first: page * tilesPerPage + tilesPerPage * 3 - edges.length,
            after: pageInfo?.endCursor,
          },
        })
      }
    }
  }

  const videos = (isSearching ? foundVideos : edges?.map((edge) => edge.node)) ?? []
  const paginatedVideos = isSearching
    ? videos.slice(currentSearchPage * tilesPerPage, currentSearchPage * tilesPerPage + tilesPerPage)
    : videos.slice(currentPage * tilesPerPage, currentPage * tilesPerPage + tilesPerPage)

  const placeholderItems = createPlaceholderData(
    loadingVideos || loadingSearch ? tilesPerPage - (paginatedVideos ? paginatedVideos.length : 0) : 0
  )

  const videosWithPlaceholders = [...(paginatedVideos || []), ...placeholderItems]

  if (videosError) {
    return <ViewErrorFallback />
  }
  return (
    <>
      <VideoSection className={transitions.names.slide}>
        {!videosWithPlaceholders.length && isSearching && (
          <EmptyFallback title={`No videos matching "${searchedText}" query found`} variant="small" />
        )}
        {!videosWithPlaceholders.length && !isSearching && (
          <EmptyFallback title="No videos on this channel" variant="small" />
        )}
        <Grid maxColumns={null} onResize={onResize}>
          {videosWithPlaceholders.map((video, idx) => (
            <VideoTileViewer key={idx} id={video.id} detailsVariant="withoutChannel" />
          ))}
        </Grid>
      </VideoSection>
      <StyledPagination
        onChangePage={handleChangePage}
        page={isSearching ? currentSearchPage : currentPage}
        itemsPerPage={tilesPerPage}
        totalCount={isSearching ? foundVideos?.length : totalCount}
        maxPaginationLinks={7}
      />
    </>
  )
}
