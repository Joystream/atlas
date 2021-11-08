import React, { useCallback, useState } from 'react'

import {
  AssetAvailability,
  ChannelOrderByInput,
  GetVideosConnectionDocument,
  GetVideosConnectionQuery,
  GetVideosConnectionQueryVariables,
  VideoOrderByInput,
  VideoWhereInput,
} from '@/api/queries'
import { Grid } from '@/components/Grid'
import { GridHeadingContainer, TitleContainer } from '@/components/GridHeading'
import { LoadMoreButton } from '@/components/LoadMoreButton'
import { SkeletonLoader } from '@/components/SkeletonLoader'
import { Text } from '@/components/Text'
import { SvgGlyphChevronRight } from '@/components/icons'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'
import { SentryLogger } from '@/utils/logs'

import { AdditionalLink, LoadMoreButtonWrapper } from './InfiniteGrid.style'
import { useInfiniteGrid } from './useInfiniteGrid'

import { VideoTile } from '../VideoTile'

type InfiniteVideoGridProps = {
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
    const targetRowsCount = Math.max(_targetRowsCount, rowsToLoad)

    const queryVariables: { where: VideoWhereInput } = {
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
      GetVideosConnectionQuery,
      GetVideosConnectionQuery['videosConnection'],
      GetVideosConnectionQueryVariables
    >({
      query: GetVideosConnectionDocument,
      isReady: ready,
      skipCount,
      queryVariables,
      orderBy,
      targetRowsCount,
      onDemand,
      onDemandInfinite,
      activatedInfinteGrid,
      onScrollToBottom: !onDemand ? fetchMore : undefined,
      dataAccessor: (rawData) => {
        if (currentlyWatchedVideoId) {
          return (
            rawData?.videosConnection && {
              ...rawData.videosConnection,
              totalCount: rawData.videosConnection.totalCount - 1,
              edges: rawData.videosConnection.edges.filter((edge) => edge.node.id !== currentlyWatchedVideoId),
            }
          )
        }
        return rawData?.videosConnection
      },
      itemsPerRow: videosPerRow,
      onError: (error) => SentryLogger.error('Failed to fetch videos', 'InfiniteVideoGrid', error),
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
    // TODO: We should probably postpone doing first fetch until `onResize` gets called.
    // Right now we'll make the first request and then right after another one based on the resized columns

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
                    <Text variant="h4">{title}</Text>
                  )}
                  {additionalLink && (
                    <AdditionalLink
                      to={additionalLink.url}
                      size="medium"
                      variant="secondary"
                      iconPlacement="right"
                      icon={<SvgGlyphChevronRight />}
                    >
                      {additionalLink.name}
                    </AdditionalLink>
                  )}
                </TitleContainer>
              </GridHeadingContainer>
            )}
            <Grid onResize={(sizes) => setVideosPerRow(sizes.length)}>{gridContent}</Grid>
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
