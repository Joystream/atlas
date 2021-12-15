import { DocumentNode } from 'graphql'
import React, { useCallback, useState } from 'react'

import {
  AssetAvailability,
  ChannelOrderByInput,
  GetMostViewedVideosAllTimeQuery,
  GetMostViewedVideosQuery,
  GetVideosConnectionDocument,
  GetVideosConnectionQuery,
  GetVideosConnectionQueryVariables,
  VideoOrderByInput,
  VideoWhereInput,
} from '@/api/queries'
import { Grid } from '@/components/Grid'
import { GridHeadingContainer, TitleContainer } from '@/components/GridHeading'
import { Text } from '@/components/Text'
import { LoadMoreButton } from '@/components/_buttons/LoadMoreButton'
import { SvgActionChevronR } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { VideoTile } from '@/components/_video/VideoTile'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'
import { SentryLogger } from '@/utils/logs'

import { AdditionalLink, LoadMoreButtonWrapper } from './InfiniteGrid.styles'
import { useInfiniteGrid } from './useInfiniteGrid'

type InfiniteVideoGridProps = {
  query?: DocumentNode
  timePeriodDays?: number
  limit?: number
  title?: string
  titleLoader?: boolean
  videoWhereInput?: VideoWhereInput
  skipCount?: number
  ready?: boolean
  showChannel?: boolean
  className?: string
  currentlyWatchedVideoId?: string
  onDemand?: boolean
  onDemandInfinite?: boolean
  orderBy?: ChannelOrderByInput | VideoOrderByInput
  emptyFallback?: React.ReactNode
  additionalLink?: {
    name: string
    url: string
  }
}

const INITIAL_VIDEOS_PER_ROW = 4

export const InfiniteVideoGrid = React.forwardRef<HTMLElement, InfiniteVideoGridProps>(
  (
    {
      query = GetVideosConnectionDocument,
      timePeriodDays,
      limit,
      title,
      videoWhereInput,
      orderBy,
      skipCount = 0,
      ready = true,
      showChannel = true,
      className,
      currentlyWatchedVideoId,
      onDemand = false,
      onDemandInfinite = false,
      additionalLink,
      titleLoader,
      emptyFallback,
    },
    ref
  ) => {
    const [activatedInfinteGrid, setActivatedInfinteGrid] = useState(false)
    const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
    const rowsToLoad = useVideoGridRows()
    const [_targetRowsCount, setTargetRowsCount] = useState(rowsToLoad)
    const [initialGridResizeDone, setInitialGridResizeDone] = useState(false)
    const targetRowsCount = Math.max(_targetRowsCount, rowsToLoad)

    const queryVariables = {
      timePeriodDays,
      limit,
      where: {
        isPublic_eq: true,
        thumbnailPhotoAvailability_eq: AssetAvailability.Accepted,
        mediaAvailability_eq: AssetAvailability.Accepted,
        ...videoWhereInput,
      },
    }

    const fetchMore = useCallback(() => {
      setTargetRowsCount(targetRowsCount + rowsToLoad)
    }, [targetRowsCount, rowsToLoad])

    const { placeholdersCount, displayedItems, error, totalCount, loading } = useInfiniteGrid<
      GetMostViewedVideosQuery | GetVideosConnectionQuery | GetMostViewedVideosAllTimeQuery,
      GetVideosConnectionQuery['videosConnection'],
      GetVideosConnectionQueryVariables
    >({
      query: query || GetVideosConnectionDocument,
      isReady: ready && initialGridResizeDone,
      skipCount,
      queryVariables,
      orderBy,
      targetRowsCount,
      onDemand,
      onDemandInfinite,
      activatedInfinteGrid,
      onScrollToBottom: !onDemand ? fetchMore : undefined,
      itemsPerRow: videosPerRow,
      onError: (error) => SentryLogger.error('Failed to fetch videos', 'InfiniteVideoGrid', error),
      dataAccessor: (rawData) => {
        if (!rawData) {
          return
        }
        if ('mostViewedVideos' in rawData) {
          if (currentlyWatchedVideoId) {
            return (
              rawData?.mostViewedVideos && {
                ...rawData.mostViewedVideos,
                totalCount: rawData.mostViewedVideos.totalCount - 1,
                edges: rawData.mostViewedVideos.edges.filter((edge) => edge.node.id !== currentlyWatchedVideoId),
              }
            )
          }
          return rawData.mostViewedVideos
        }
        if ('videosConnection' in rawData) {
          if (currentlyWatchedVideoId) {
            return (
              rawData?.videosConnection && {
                ...rawData.videosConnection,
                totalCount: rawData.videosConnection.totalCount - 1,
                edges: rawData.videosConnection.edges.filter((edge) => edge.node.id !== currentlyWatchedVideoId),
              }
            )
          }
          return rawData.videosConnection
        }
        if ('mostViewedVideosAllTime' in rawData) {
          if (currentlyWatchedVideoId) {
            return (
              rawData?.mostViewedVideosAllTime && {
                ...rawData.mostViewedVideosAllTime,
                totalCount: rawData.mostViewedVideosAllTime.totalCount - 1,
                edges: rawData.mostViewedVideosAllTime.edges.filter((edge) => edge.node.id !== currentlyWatchedVideoId),
              }
            )
          }
          return rawData.mostViewedVideosAllTime
        }
      },
    })

    const placeholderItems = Array.from({ length: placeholdersCount }, () => ({ id: undefined }))
    const gridContent = (
      <>
        {[...displayedItems, ...placeholderItems]?.map((video, idx) => (
          <VideoTile id={video.id} key={idx} showChannel={showChannel} />
        ))}
      </>
    )

    if (error) {
      return null
    }

    if (displayedItems.length <= 0 && placeholdersCount <= 0 && !emptyFallback) {
      return null
    }

    const shouldShowLoadMoreButton =
      (onDemand || (onDemandInfinite && !activatedInfinteGrid)) && !loading && displayedItems.length < totalCount

    return (
      <section ref={ref} className={className}>
        {totalCount === 0 && !loading && !!emptyFallback ? (
          emptyFallback
        ) : (
          <>
            {title && (
              <GridHeadingContainer>
                <TitleContainer>
                  {(!ready || !displayedItems.length) && titleLoader ? (
                    <SkeletonLoader height={30} width={250} />
                  ) : (
                    <Text variant="h500">{title}</Text>
                  )}
                  {additionalLink && (
                    <AdditionalLink
                      to={additionalLink.url}
                      size="medium"
                      variant="secondary"
                      iconPlacement="right"
                      icon={<SvgActionChevronR />}
                    >
                      {additionalLink.name}
                    </AdditionalLink>
                  )}
                </TitleContainer>
              </GridHeadingContainer>
            )}
            <Grid
              onResize={(sizes) => {
                setVideosPerRow(sizes.length)
                if (!initialGridResizeDone) {
                  setInitialGridResizeDone(true)
                }
              }}
            >
              {gridContent}
            </Grid>
            {shouldShowLoadMoreButton && (
              <LoadMoreButtonWrapper>
                <LoadMoreButton
                  label={onDemandInfinite ? 'Keep loading videos' : undefined}
                  onClick={() => {
                    fetchMore()
                    if (onDemandInfinite) {
                      setActivatedInfinteGrid(true)
                    }
                  }}
                />
              </LoadMoreButtonWrapper>
            )}
          </>
        )}
      </section>
    )
  }
)
InfiniteVideoGrid.displayName = 'InfiniteVideoGrid'
