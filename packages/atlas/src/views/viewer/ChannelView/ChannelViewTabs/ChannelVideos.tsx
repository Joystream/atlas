import { FC, useEffect } from 'react'

import { useBasicVideoPagination } from '@/api/hooks/video'
import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { BasicVideoFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Grid } from '@/components/Grid'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { usePersonalDataStore } from '@/providers/personalData'
import { transitions } from '@/styles'
import { InteractionsService } from '@/utils/InteractionsService'
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
  const { currentPage, setCurrentPage, currentSearchPage, setCurrentSearchPage } = usePagination(0)
  const { lastGlobalRecommendationId } = usePersonalDataStore()
  const {
    videos: data,
    totalCount,
    error: videosError,
    loading: isLoading,
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
      setCurrentPage(page)
    }
  }

  const videos =
    (isSearching
      ? foundVideos?.slice(currentSearchPage * tilesPerPage, currentSearchPage * tilesPerPage + tilesPerPage)
      : data) ?? []

  const placeholderItems = createPlaceholderData(
    isLoading || loadingSearch ? tilesPerPage - (videos ? videos.length : 0) : 0
  )

  const videosWithPlaceholders = [...(videos || []), ...placeholderItems]

  if (videosError) {
    return <ViewErrorFallback />
  }
  return (
    <>
      <VideoSection className={transitions.names.slide}>
        {!videosWithPlaceholders.length && isSearching && (
          <EmptyFallback title={`No videos matching "${searchedText}" query found`} variant="large" />
        )}
        {!videosWithPlaceholders.length && !isSearching && (
          <EmptyFallback title="No videos on this channel" variant="large" />
        )}
        <Grid maxColumns={null} onResize={onResize}>
          {videosWithPlaceholders.map((video, idx) => (
            <VideoTileViewer
              key={idx}
              id={video.id}
              onClick={() => {
                InteractionsService.channelClicked(
                  channelId,
                  lastGlobalRecommendationId ? { recommId: lastGlobalRecommendationId } : undefined
                )
                video.id &&
                  InteractionsService.videoClicked(
                    video.id,
                    lastGlobalRecommendationId ? { recommId: lastGlobalRecommendationId } : undefined
                  )
              }}
              detailsVariant="withoutChannel"
            />
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
