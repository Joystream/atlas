import { GET_VIDEOS_CONNECTION } from '@/api/queries/videos'

import VideoPreview from '@/components/VideoPreviewWithNavigation'
import { Grid, Text, VideoPreviewBase } from '@/shared/components'
import { sizes } from '@/shared/theme'
import styled from '@emotion/styled'
import React, { useCallback, useMemo, useState } from 'react'
import useInfiniteGrid from './useInfiniteGrid'

import { GetVideosConnection, GetVideosConnectionVariables } from '@/api/queries/__generated__/GetVideosConnection'

type InfiniteFollowedChannelsVideoGridProps = {
  title?: string
  channelIdIn?: string[]
  createdAtGte?: Date
  skipCount?: number
  ready?: boolean
  showChannel?: boolean
  className?: string
}

const INITIAL_ROWS = 4
const INITIAL_VIDEOS_PER_ROW = 4

const InfiniteFollowedChannelsVideoGrid: React.FC<InfiniteFollowedChannelsVideoGridProps> = ({
  title,
  skipCount = 0,
  ready = true,
  showChannel = true,
  className,
  channelIdIn,
  createdAtGte,
}) => {
  const [videosPerRow, setVideosPerRow] = useState(INITIAL_VIDEOS_PER_ROW)
  const queryVariables = useMemo(
    () => ({
      ...(channelIdIn?.length ? { channelIdIn } : {}),
      ...(createdAtGte ? { createdAtGte } : {}),
    }),
    [channelIdIn, createdAtGte]
  )
  const [targetRowsCount, setTargetRowsCount] = useState(INITIAL_ROWS)

  const onScrollToBottom = useCallback(() => {
    setTargetRowsCount((prevState) => prevState + 2)
  }, [])

  const { placeholdersCount, displayedItems, error } = useInfiniteGrid<
    GetVideosConnection,
    GetVideosConnection['videosConnection'],
    GetVideosConnectionVariables
  >({
    query: GET_VIDEOS_CONNECTION,
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

export default InfiniteFollowedChannelsVideoGrid
