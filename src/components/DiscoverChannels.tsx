import styled from '@emotion/styled'
import React from 'react'

import { ChannelEdge, VideoEdge } from '@/api/queries'
import { InfiniteChannelWithVideosGrid } from '@/components/InfiniteGrids'
import { sizes } from '@/shared/theme'

const MOST_FOLLOWED_CHANNELS_LIMIT = 100

export const DiscoverChannels = () => {
  const sortChannelsByViewsDesc = (edges?: ChannelEdge[] | VideoEdge[]) => {
    if (!edges) {
      return []
    }
    return [...edges].sort((a, b) => {
      if ('follows' in b.node && 'follows' in a.node) {
        return (b.node.follows || 0) - (a.node.follows || 0)
      } else {
        return 0
      }
    })
  }

  return (
    <StyledInfiniteChannelWithVideosGrid
      title="Discover channels"
      first={MOST_FOLLOWED_CHANNELS_LIMIT}
      onDemand
      additionalSortFn={sortChannelsByViewsDesc}
      sortByViewsOrFollowers
    />
  )
}

const StyledInfiniteChannelWithVideosGrid = styled(InfiniteChannelWithVideosGrid)`
  :not(:last-of-type) {
    margin-bottom: ${sizes(38)};
  }
`
