import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React, { useCallback, useState } from 'react'

import {
  GetChannelsConnectionDocument,
  GetChannelsConnectionQuery,
  GetChannelsConnectionQueryVariables,
} from '@/api/queries'
import { Grid } from '@/components/Grid'
import { Text } from '@/components/Text'
import { ChannelCard } from '@/components/_channel/ChannelCard'
import { sizes } from '@/theme'
import { SentryLogger } from '@/utils/logs'

import { useInfiniteGrid } from './useInfiniteGrid'

type InfiniteChannelGridProps = {
  title?: string
  skipCount?: number
  ready?: boolean
  className?: string
}

const INITIAL_ROWS = 4
const INITIAL_CHANNELS_PER_ROW = 7
const QUERY_VARIABLES = {
  where: {
    isPublic_eq: true,
    isCensored_eq: false,
  },
}

export const InfiniteChannelGrid: React.FC<InfiniteChannelGridProps> = ({
  title,
  skipCount = 0,
  ready = true,
  className,
}) => {
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
    onError: (error) => SentryLogger.error('Failed to fetch channels', 'InfiniteChannelsGrid', error),
  })

  const placeholderItems = Array.from({ length: placeholdersCount }, () => ({ id: undefined }))
  const gridContent = (
    <>
      {/* we are reusing the components below by giving them the same keys */}
      {[...displayedItems, ...placeholderItems].map((channel, idx) => (
        <StyledChannelCard key={idx} id={channel.id} />
      ))}
    </>
  )

  if (error) {
    return null
  }

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

const StyledChannelCard = styled(ChannelCard)`
  ${previewCss};
`
