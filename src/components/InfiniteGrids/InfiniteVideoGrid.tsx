import React, { useCallback, useEffect, useState } from 'react'
import styled from '@emotion/styled'

import { sizes } from '@/shared/theme'
import { Grid, Text, VideoPreviewBase } from '@/shared/components'
import VideoPreview from '@/components/VideoPreviewWithNavigation'
import { GET_NEWEST_VIDEOS } from '@/api/queries'
import { GetNewestVideos, GetNewestVideosVariables } from '@/api/queries/__generated__/GetNewestVideos'
import useInfiniteGrid from './useInfiniteGrid'

type InfiniteVideoGridProps = {
  title?: string
  categoryId?: string
  channelId?: string
  skipCount?: number
  ready?: boolean
  showChannel?: boolean
  className?: string
}

const INITIAL_ROWS = 4
const INITIAL_VIDEOS_PER_ROW = 4

const InfiniteVideoGrid: React.FC<InfiniteVideoGridProps> = ({
  title,
  categoryId = '',
  channelId = null,
  skipCount = 0,
  ready = true,
  showChannel = true,
  className,
}) => {
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  const [queryVariables, setQueryVariables] = useState({
    ...(channelId ? { channelId } : {}),
    ...(categoryId ? { categoryId } : {}),
  })

  const [targetRowsCountByCategory, setTargetRowsCountByCategory] = useState<Record<string, number>>({
    [categoryId]: INITIAL_ROWS,
  })
  const [cachedChannelId, setCachedChannelId] = useState<string | null>(channelId)
  const [cachedCategoryId, setCachedCategoryId] = useState<string>(categoryId)

  const targetRowsCount = targetRowsCountByCategory[cachedCategoryId]

  const onScrollToBottom = useCallback(() => {
    setTargetRowsCountByCategory((prevState) => ({
      ...prevState,
      [cachedCategoryId]: targetRowsCount + 2,
    }))
  }, [cachedCategoryId, targetRowsCount])

  const { placeholdersCount, displayedItems, error } = useInfiniteGrid<
    GetNewestVideos,
    GetNewestVideos['videosConnection'],
    GetNewestVideosVariables
  >({
    query: GET_NEWEST_VIDEOS,
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
  }, [categoryId, channelId, cachedCategoryId, targetRowsCountByCategory, videosPerRow, skipCount])

  // handle channel change
  useEffect(() => {
    if (channelId === cachedChannelId) {
      return
    }

    setCachedChannelId(channelId)

    setQueryVariables({
      ...(channelId ? { channelId } : {}),
      ...(categoryId ? { categoryId } : {}),
    })
  }, [channelId, cachedChannelId, categoryId])

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
      {title && <Title variant="h5">{title}</Title>}
      <Grid onResize={(sizes) => setVideosPerRow(sizes.length)}>{gridContent}</Grid>
    </section>
  )
}

const Title = styled(Text)`
  margin-bottom: ${sizes(4)};
`

export default InfiniteVideoGrid
