import { FC, useEffect, useState } from 'react'

import { useBasicVideoPagination } from '@/api/hooks/video'
import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { BasicVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Grid } from '@/components/Grid'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { transitions } from '@/styles'
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

const USER_TIMESTAMP = new Date()
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
  // not sure why - but apollo hook doesn't refetch when variables change
  const [isLoading, setIsLoading] = useState(false)
  const { currentPage, setCurrentPage, currentSearchPage, setCurrentSearchPage } = usePagination(0)
  const {
    videos: data,
    totalCount,
    refetch,
    error: videosError,
  } = useBasicVideoPagination({
    onError: (error) => SentryLogger.error('Failed to fetch videos', 'ChannelView', error, { channel: { channelId } }),
    variables: {
      orderBy: sortVideosBy,
      limit: tilesPerPage,
      offset: currentPage * tilesPerPage,
      where: {
        channel: {
          id_eq: channelId,
        },
        isPublic_eq: true,
        createdAt_lt: USER_TIMESTAMP,
        isCensored_eq: false,
        thumbnailPhoto: {
          isAccepted_eq: true,
        },
        media: {
          isAccepted_eq: true,
        },
      },
    },
  })

  // set page to 0 when sortVideosBy changed
  useEffect(() => {
    setCurrentPage(0)
  }, [setCurrentPage, sortVideosBy])

  const handleChangePage = (page: number) => {
    if (isSearching) {
      setCurrentSearchPage(page)
    } else {
      setIsLoading(true)
      setCurrentPage(page)
      refetch({ offset: tilesPerPage * page }).finally(() => setIsLoading(false))
    }
  }

  const videos =
    (isSearching
      ? foundVideos?.slice(currentSearchPage * tilesPerPage, currentSearchPage * tilesPerPage + tilesPerPage)
      : data) ?? []

  const placeholderItems = Array.from(
    { length: isLoading || loadingSearch ? tilesPerPage - (videos ? videos.length : 0) : 0 },
    () => ({
      id: undefined,
    })
  )

  const videosWithPlaceholders = [...(videos || []), ...placeholderItems]

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
