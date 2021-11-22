import styled from '@emotion/styled'
import React from 'react'

import { ChannelEdge, ChannelOrderByInput, VideoEdge } from '@/api/queries'
import { InfiniteChannelWithVideosGrid } from '@/components/InfiniteGrids'
import { sizes } from '@/styles'

type DiscoverChannelsProps = {
  additionalLink?: {
    name: string
    url: string
  }
}

export const DiscoverChannels: React.FC<DiscoverChannelsProps> = ({ additionalLink }) => {
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
      title="Discover new channels"
      onDemand
      orderBy={ChannelOrderByInput.CreatedAtDesc}
      additionalSortFn={sortChannelsByFollowsDesc}
      additionalLink={additionalLink}
    />
  )
}

const StyledInfiniteChannelWithVideosGrid = styled(InfiniteChannelWithVideosGrid)`
  :not(:last-of-type) {
    margin-bottom: ${sizes(38)};
  }
`
