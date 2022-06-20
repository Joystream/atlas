import { QueryHookOptions } from '@apollo/client'
import { DocumentNode } from 'graphql'
import { ReactNode, forwardRef, useCallback, useState } from 'react'

import {
  GetBasicVideosConnectionDocument,
  GetBasicVideosConnectionQuery,
  GetBasicVideosConnectionQueryVariables,
  GetMostViewedVideosConnectionQuery,
  GetMostViewedVideosConnectionQueryVariables,
  VideoOrderByInput,
  VideoWhereInput,
} from '@/api/queries'
import { Grid } from '@/components/Grid'
import { GridHeadingContainer, TitleContainer } from '@/components/GridHeading'
import { Text } from '@/components/Text'
import { LoadMoreButton } from '@/components/_buttons/LoadMoreButton'
import { SvgActionChevronR } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'
import { SentryLogger } from '@/utils/logs'

import { AdditionalLink, LoadMoreButtonWrapper } from './InfiniteGrid.styles'
import { useInfiniteGrid } from './useInfiniteGrid'

import { VideoTileViewer } from '../_video/VideoTileViewer'

type InfiniteVideoGridProps = {
  query?: DocumentNode
  queryOpts?: QueryHookOptions
  // `periodDays` argument to be passed to the most viewed connection query - it will let you set the time period of most views
  periodDays?: number
  // `limit` argument to be passed to the most viewed connection query - it will let you cap the number of videos in the connection
  limit?: number
  title?: string
  titleLoader?: boolean
  videoWhereInput?: VideoWhereInput
  skipCount?: number
  ready?: boolean
  showChannel?: boolean
  className?: string
  // exclude a specific video from the result
  excludeId?: string
  onDemand?: boolean
  onDemandInfinite?: boolean
  orderBy?: VideoOrderByInput
  emptyFallback?: ReactNode
  additionalLink?: {
    name: string
    url: string
  }
}

const INITIAL_VIDEOS_PER_ROW = 1

type VideoQuery = GetBasicVideosConnectionQuery | GetMostViewedVideosConnectionQuery

export const InfiniteVideoGrid = forwardRef<HTMLElement, InfiniteVideoGridProps>(
  (
    {
      query = GetBasicVideosConnectionDocument,
      queryOpts,
      periodDays,
      limit,
      title,
      videoWhereInput,
      orderBy,
      skipCount = 0,
      ready = true,
      className,
      excludeId,
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

    const queryVariables: GetBasicVideosConnectionQueryVariables & GetMostViewedVideosConnectionQueryVariables = {
      periodDays,
      limit,
      orderBy,
      where: {
        isPublic_eq: true,
        isCensored_eq: false,
        thumbnailPhoto: {
          isAccepted_eq: true,
        },
        media: {
          isAccepted_eq: true,
        },
        ...(videoWhereInput ? videoWhereInput : {}),
      },
    }

    const fetchMore = useCallback(() => {
      setTargetRowsCount(targetRowsCount + rowsToLoad)
    }, [targetRowsCount, rowsToLoad])

    const { placeholdersCount, displayedItems, error, totalCount, loading } = useInfiniteGrid<
      VideoQuery,
      GetBasicVideosConnectionQuery['videosConnection'],
      GetBasicVideosConnectionQueryVariables
    >({
      query: query || GetBasicVideosConnectionDocument,
      queryOpts,
      isReady: ready && initialGridResizeDone,
      skipCount,
      queryVariables,
      targetRowsCount,
      onDemand,
      onDemandInfinite,
      activatedInfinteGrid,
      onScrollToBottom: !onDemand ? fetchMore : undefined,
      itemsPerRow: videosPerRow,
      onError: (error) => SentryLogger.error('Failed to fetch videos', 'InfiniteVideoGrid', error),
      dataAccessor: createRawDataAccessor(excludeId),
    })

    const placeholderItems = Array.from({ length: placeholdersCount }, () => ({ id: undefined }))
    const gridContent = (
      <>
        {[...displayedItems, ...placeholderItems]?.map((video, idx) => (
          <VideoTileViewer id={video.id} key={idx} />
        ))}
      </>
    )

    if (error) {
      return null
    }

    const hasNoItems = ready && initialGridResizeDone && !loading && totalCount === 0
    if (hasNoItems && !emptyFallback) {
      return null
    }

    const shouldShowLoadMoreButton =
      (onDemand || (onDemandInfinite && !activatedInfinteGrid)) && !loading && displayedItems.length < totalCount

    return (
      <section ref={ref} className={className}>
        {hasNoItems && !!emptyFallback ? (
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

const createRawDataAccessor = (excludeId?: string) => (rawData?: VideoQuery) => {
  if (!rawData) {
    return
  }

  const queryResult =
    'videosConnection' in rawData
      ? rawData.videosConnection
      : 'mostViewedVideosConnection' in rawData
      ? rawData.mostViewedVideosConnection
      : null
  if (!queryResult) {
    SentryLogger.error('Unknown property in query data', 'InfiniteVideoGrid', null, { query: { rawData } })
    throw new Error("Couldn't access data for video grid")
  }

  if (!excludeId) {
    return queryResult
  }

  return {
    ...queryResult,
    totalCount: queryResult.totalCount - 1,
    edges: queryResult.edges.filter((edge) => edge.node.id !== excludeId),
  }
}
