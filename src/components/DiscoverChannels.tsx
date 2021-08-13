import styled from '@emotion/styled'
import React from 'react'

import { ChannelEdge, VideoEdge } from '@/api/queries'
import { InfiniteChannelWithVideosGrid } from '@/components/InfiniteGrids'
import { sizes } from '@/shared/theme'

export const DiscoverChannels: React.FC = () => {
  const sortChannelsByFollowsDesc = (edges?: ChannelEdge[] | VideoEdge[]) => {
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
      onDemand
      additionalSortFn={sortChannelsByFollowsDesc}
    />
  )
}

const StyledInfiniteChannelWithVideosGrid = styled(InfiniteChannelWithVideosGrid)`
  :not(:last-of-type) {
    margin-bottom: ${sizes(38)};
  }
`
