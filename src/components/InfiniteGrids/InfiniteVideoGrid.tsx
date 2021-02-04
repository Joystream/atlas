import React, { useCallback, useEffect, useState } from 'react'
import styled from '@emotion/styled'

import { sizes } from '@/shared/theme'
import { Grid, Text, VideoPreviewBase, Placeholder } from '@/shared/components'
import VideoPreview from '@/components/VideoPreviewWithNavigation'
import { GetVideosConnectionDocument, GetVideosConnectionQuery, GetVideosConnectionQueryVariables } from '@/api/queries'
import useInfiniteGrid from './useInfiniteGrid'

type InfiniteVideoGridProps = {
  title?: string
  isTitleLoading?: boolean
  categoryId?: string
  channelId?: string
  channelIdIn?: string[] | null
  createdAtGte?: Date | null
  skipCount?: number
  ready?: boolean
  showChannel?: boolean
  className?: string
}

const INITIAL_ROWS = 4
const INITIAL_VIDEOS_PER_ROW = 4

const InfiniteVideoGrid: React.FC<InfiniteVideoGridProps> = ({
  title,
  isTitleLoading,
  categoryId = '',
  channelId = null,
  channelIdIn = null,
  createdAtGte = null,
  skipCount = 0,
  ready = true,
  showChannel = true,
  className,
}) => {
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  const [queryVariables, setQueryVariables] = useState({
    ...(channelId ? { channelId } : {}),
    ...(channelIdIn ? { channelIdIn } : {}),
    ...(createdAtGte ? { createdAtGte } : {}),
    ...(categoryId ? { categoryId } : {}),
  })

  const [targetRowsCountByCategory, setTargetRowsCountByCategory] = useState<Record<string, number>>({
    [categoryId]: INITIAL_ROWS,
  })
  const [cachedChannelId, setCachedChannelId] = useState<string | null>(channelId)
  const [cachedChannelIdIn, setCachedChannelIdIn] = useState<string[] | null>(channelIdIn)
  const [cachedCreatedAtGte, setCachedCreatedAtGte] = useState<Date | null>(createdAtGte)
  const [cachedCategoryId, setCachedCategoryId] = useState<string>(categoryId)

  const targetRowsCount = targetRowsCountByCategory[cachedCategoryId]

  const onScrollToBottom = useCallback(() => {
    setTargetRowsCountByCategory((prevState) => ({
      ...prevState,
      [cachedCategoryId]: targetRowsCount + 2,
    }))
  }, [cachedCategoryId, targetRowsCount])

  const { placeholdersCount, displayedItems, error } = useInfiniteGrid<
    GetVideosConnectionQuery,
    GetVideosConnectionQuery['videosConnection'],
    GetVideosConnectionQueryVariables
  >({
    query: GetVideosConnectionDocument,
    onScrollToBottom,
    isReady: ready,
    skipCount,
    queryVariables,
    targetRowsCount,
    dataAccessor: (rawData) => rawData?.videosConnection,
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

    setQueryVariables({
      ...(channelId ? { channelId } : {}),
      ...(channelIdIn ? { channelIdIn } : {}),
      ...(createdAtGte ? { createdAtGte } : {}),
      ...(categoryId ? { categoryId } : {}),
    })

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

  // handle channelId change
  useEffect(() => {
    if (channelId === cachedChannelId) {
      return
    }

    setCachedChannelId(channelId)

    setQueryVariables({
      ...(channelId ? { channelId } : {}),
      ...(channelIdIn ? { channelIdIn } : {}),
      ...(createdAtGte ? { createdAtGte } : {}),
      ...(categoryId ? { categoryId } : {}),
    })
  }, [channelId, cachedChannelId, categoryId, channelIdIn, createdAtGte])

  useEffect(() => {
    if (JSON.stringify(cachedChannelIdIn) === JSON.stringify(channelIdIn)) {
      return
    }

    setCachedChannelIdIn(channelIdIn)

    setQueryVariables({
      ...(channelId ? { channelId } : {}),
      ...(channelIdIn ? { channelIdIn } : {}),
      ...(createdAtGte ? { createdAtGte } : {}),
      ...(categoryId ? { categoryId } : {}),
    })
  }, [cachedChannelIdIn, categoryId, channelId, channelIdIn, createdAtGte])

  useEffect(() => {
    if (createdAtGte === cachedCreatedAtGte) {
      return
    }

    setCachedCreatedAtGte(createdAtGte)

    setQueryVariables({
      ...(channelId ? { channelId } : {}),
      ...(channelIdIn ? { channelIdIn } : {}),
      ...(createdAtGte ? { createdAtGte } : {}),
      ...(categoryId ? { categoryId } : {}),
    })
  }, [cachedCreatedAtGte, categoryId, channelId, channelIdIn, createdAtGte])

  const gridContent = (
    <>
      {displayedItems.map((v) => (
        <VideoPreview
          id={v.id}
          channelId={v.channel.id}
          title={v.title}
          channelName={v.channel.handle}
          channelAvatarURL={v.channel.avatarPhotoUrl}
          createdAt={v.createdAt}
          views={v.views}
          posterURL={v.thumbnailUrl}
          showChannel={showChannel}
          key={v.id}
        />
      ))}
      {Array.from({ length: placeholdersCount }, (_, idx) => (
        <VideoPreviewBase key={idx} showChannel={showChannel} />
      ))}
    </>
  )

  if (displayedItems.length <= 0 && placeholdersCount <= 0) {
    return null
  }

  return (
    <section className={className}>
      {isTitleLoading ? <StyledPlaceholder height={23} width={250} /> : <Title variant="h5">{title}</Title>}
      <Grid onResize={(sizes) => setVideosPerRow(sizes.length)}>{gridContent}</Grid>
    </section>
  )
}

const Title = styled(Text)`
  margin-bottom: ${sizes(4)};
`

const StyledPlaceholder = styled(Placeholder)`
  margin-bottom: ${sizes(4)};
`

export default InfiniteVideoGrid
