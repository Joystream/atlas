import { GET_FOLLOWED_CHANNELS_RECENT_VIDEOS } from '@/api/queries/videos'

import VideoPreview from '@/components/VideoPreviewWithNavigation'
import { Grid, Text, VideoPreviewBase } from '@/shared/components'
import { sizes } from '@/shared/theme'
import styled from '@emotion/styled'
import React, { useCallback, useMemo, useState } from 'react'
import useInfiniteGrid from './useInfiniteGrid'
import {
  GetFollowedChannelsRecentVideos,
  GetFollowedChannelsRecentVideosVariables,
} from '@/api/queries/__generated__/GetFollowedChannelsRecentVideos'

type InfiniteFollowedChannelsVideoGridProps = {
  title?: string
  channelIdIn?: string[]
  createdAtGte?: Date
  skipCount?: number
  videosToNotInclude?: string[]
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
  videosToNotInclude,
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
    GetFollowedChannelsRecentVideos,
    GetFollowedChannelsRecentVideos['videosConnection'],
    GetFollowedChannelsRecentVideosVariables
  >({
    query: GET_FOLLOWED_CHANNELS_RECENT_VIDEOS,
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

  const items = displayedItems.filter((item) => !videosToNotInclude?.includes(item.id))

  const gridContent = (
    <>
      {items.map((v) => (
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

  if (items.length <= 0 && placeholdersCount <= 0) {
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
