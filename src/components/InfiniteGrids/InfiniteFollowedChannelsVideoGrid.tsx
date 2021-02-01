import VideoPreview from '@/components/VideoPreviewWithNavigation'
import { Grid, Text, VideoPreviewBase, Placeholder } from '@/shared/components'
import { sizes } from '@/shared/theme'
import styled from '@emotion/styled'
import React, { useCallback, useMemo, useState } from 'react'
import useInfiniteGrid from './useInfiniteGrid'
import { GetVideosConnectionQuery, GetVideosConnectionQueryVariables, GetVideosConnectionDocument } from '@/api/queries'

type InfiniteFollowedChannelsVideoGridProps = {
  title?: string
  isTitleLoading?: boolean
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
  isTitleLoading,
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

export default InfiniteFollowedChannelsVideoGrid
