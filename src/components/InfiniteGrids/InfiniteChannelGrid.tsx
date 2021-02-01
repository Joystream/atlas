import React, { useCallback, useState } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/core'

import { sizes } from '@/shared/theme'
import { ChannelPreviewBase, Grid, Text } from '@/shared/components'
import {
  GetChannelsConnectionDocument,
  GetChannelsConnectionQuery,
  GetChannelsConnectionQueryVariables,
} from '@/api/queries/channels'
import ChannelPreview from '@/components/ChannelPreviewWithNavigation'
import useInfiniteGrid from './useInfiniteGrid'

type InfiniteChannelGridProps = {
  title?: string
  skipCount?: number
  ready?: boolean
  className?: string
}

const INITIAL_ROWS = 4
const INITIAL_CHANNELS_PER_ROW = 4
const QUERY_VARIABLES = {}

const InfiniteChannelGrid: React.FC<InfiniteChannelGridProps> = ({ title, skipCount = 0, ready = true, className }) => {
  const [channelsPerRow, setChannelsPerRow] = useState(INITIAL_CHANNELS_PER_ROW)
  const [targetRowsCount, setTargetRowsCount] = useState(INITIAL_ROWS)

  const onScrollToBottom = useCallback(() => {
    setTargetRowsCount((prevState) => prevState + 2)
  }, [])

  const { placeholdersCount, displayedItems, error } = useInfiniteGrid<
    GetChannelsConnectionQuery,
    GetChannelsConnectionQuery['channelsConnection'],
    GetChannelsConnectionQueryVariables
  >({
    query: GetChannelsConnectionDocument,
    onScrollToBottom,
    isReady: ready,
    skipCount,
    queryVariables: QUERY_VARIABLES,
    targetRowsCount,
    dataAccessor: (rawData) => rawData?.channelsConnection,
    itemsPerRow: channelsPerRow,
  })

  if (error) {
    throw error
  }

  const gridContent = (
    <>
      {displayedItems.map((channel) => (
        <StyledChannelPreview
          key={channel.id}
          id={channel.id}
          name={channel.handle}
          avatarURL={channel.avatarPhotoUrl}
          animated
        />
      ))}
      {Array.from({ length: placeholdersCount }, (_, idx) => (
        <StyledChannelPreviewBase key={idx} />
      ))}
    </>
  )

  if (displayedItems.length <= 0 && placeholdersCount <= 0) {
    return null
  }

  return (
    <section className={className}>
      {title && <Title variant="h5">{title}</Title>}
      <Grid onResize={(sizes) => setChannelsPerRow(sizes.length)} minWidth={200} maxColumns={null}>
        {gridContent}
      </Grid>
    </section>
  )
}

const Title = styled(Text)`
  margin-bottom: ${sizes(4)};
`

const previewCss = css`
  margin: 0 auto;
`

const StyledChannelPreview = styled(ChannelPreview)`
  ${previewCss};
`

const StyledChannelPreviewBase = styled(ChannelPreviewBase)`
  ${previewCss};
`

export default InfiniteChannelGrid
