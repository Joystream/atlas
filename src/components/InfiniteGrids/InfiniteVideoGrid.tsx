import styled from '@emotion/styled'
import React, { useCallback, useEffect, useState } from 'react'

import {
  AssetAvailability,
  GetVideosConnectionDocument,
  GetVideosConnectionQuery,
  GetVideosConnectionQueryVariables,
  VideoWhereInput,
} from '@/api/queries'
import { Grid, LoadMoreButton, Placeholder, Text } from '@/shared/components'
import { sizes } from '@/shared/theme'

import { useInfiniteGrid } from './useInfiniteGrid'

import { VideoPreview } from '../VideoPreview'

type InfiniteVideoGridProps = {
  title?: string
  categoryId?: string
  channelId?: string
  channelIdIn?: string[] | null
  createdAtGte?: Date | null
  isPublic?: boolean
  isCensored?: boolean
  thumbnailPhotoAvailability?: AssetAvailability
  mediaAvailability?: AssetAvailability
  skipCount?: number
  ready?: boolean
  showChannel?: boolean
  className?: string
  currentlyWatchedVideoId?: string
}

const INITIAL_ROWS = 2
const INITIAL_VIDEOS_PER_ROW = 4

export const InfiniteVideoGrid: React.FC<InfiniteVideoGridProps> = ({
  title,
  categoryId = '',
  channelId = null,
  channelIdIn = null,
  createdAtGte = null,
  isPublic = true,
  isCensored = false,
  thumbnailPhotoAvailability = AssetAvailability.Accepted,
  mediaAvailability = AssetAvailability.Accepted,
  skipCount = 0,
  ready = true,
  showChannel = true,
  className,
  currentlyWatchedVideoId,
}) => {
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  const queryVariables: { where: VideoWhereInput } = {
    where: {
      ...(channelId ? { channelId_eq: channelId } : {}),
      ...(channelIdIn ? { channelId_in: channelIdIn } : {}),
      ...(createdAtGte ? { createdAt_gte: createdAtGte } : {}),
      ...(categoryId ? { categoryId_eq: categoryId } : {}),
      ...(thumbnailPhotoAvailability ? { thumbnailPhotoAvailability_eq: thumbnailPhotoAvailability } : {}),
      ...(mediaAvailability ? { mediaAvailability_eq: mediaAvailability } : {}),
      isPublic_eq: isPublic,
      isCensored_eq: isCensored,
    },
  }

  const [targetRowsCountByCategory, setTargetRowsCountByCategory] = useState<Record<string, number>>({
    [categoryId]: INITIAL_ROWS,
  })
  const [cachedCategoryId, setCachedCategoryId] = useState<string>(categoryId)

  const targetRowsCount = targetRowsCountByCategory[cachedCategoryId]

  const fetchMore = useCallback(() => {
    setTargetRowsCountByCategory((prevState) => ({
      ...prevState,
      [cachedCategoryId]: targetRowsCount + 2,
    }))
  }, [cachedCategoryId, targetRowsCount])

  const { placeholdersCount, displayedItems, error, allItemsLoaded } = useInfiniteGrid<
    GetVideosConnectionQuery,
    GetVideosConnectionQuery['videosConnection'],
    GetVideosConnectionQueryVariables
  >({
    query: GetVideosConnectionDocument,
    isReady: ready,
    skipCount,
    queryVariables,
    targetRowsCount,
    onDemand: true,
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
  })

  if (error) {
    throw error
  }

  // handle category change
  // TODO potentially move into useInfiniteGrid as a general rule - keep separate targetRowsCount per serialized queryVariables
  useEffect(() => {
    if (categoryId === cachedCategoryId) {
      return
    }

    setCachedCategoryId(categoryId)

    const categoryRowsSet = !!targetRowsCountByCategory[categoryId]
    const categoryRowsCount = categoryRowsSet ? targetRowsCountByCategory[categoryId] : INITIAL_ROWS
    if (!categoryRowsSet) {
      setTargetRowsCountByCategory((prevState) => ({
        ...prevState,
        [categoryId]: categoryRowsCount,
      }))
    }
  }, [
    categoryId,
    channelId,
    cachedCategoryId,
    targetRowsCountByCategory,
    videosPerRow,
    skipCount,
    channelIdIn,
    createdAtGte,
  ])

  const placeholderItems = Array.from({ length: placeholdersCount }, () => ({ id: undefined }))
  const gridContent = (
    <>
      {[...displayedItems, ...placeholderItems]?.map((video, idx) => (
        <VideoPreview id={video.id} key={idx} showChannel={showChannel} />
      ))}
    </>
  )

  if (displayedItems.length <= 0 && placeholdersCount <= 0) {
    return null
  }

  // TODO: We should probably postpone doing first fetch until `onResize` gets called.
  // Right now we'll make the first request and then right after another one based on the resized columns
  return (
    <section className={className}>
      {title && (!ready ? <StyledPlaceholder height={23} width={250} /> : <Title variant="h5">{title}</Title>)}
      <Grid onResize={(sizes) => setVideosPerRow(sizes.length)}>{gridContent}</Grid>
      {!allItemsLoaded && <LoadMoreButton onClick={fetchMore} />}
    </section>
  )
}

const Title = styled(Text)`
  margin-bottom: ${sizes(4)};
`

const StyledPlaceholder = styled(Placeholder)`
  margin-bottom: ${sizes(4)};
`
