import React from 'react'

import { ChannelEdge, ChannelOrderByInput, VideoEdge } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'

import { InfiniteChannelWithVideosGrid } from '../InfiniteGrids'

export const PromisingNewChannels = () => {
  const sortChannelsByViewsDesc = (edges?: ChannelEdge[] | VideoEdge[]) => {
    if (!edges) {
      return []
    }
    return [...edges].sort((a, b) => {
      return (b.node.views || 0) - (a.node.views || 0)
    })
  }

  return (
    <InfiniteChannelWithVideosGrid
      title="Promising new channels"
      onDemand
      first={100}
      orderBy={ChannelOrderByInput.CreatedAtDesc}
      additionalLink={{
        name: 'Browse Channels',
        url: absoluteRoutes.viewer.channels(),
      }}
      additionalSortFn={sortChannelsByViewsDesc}
    />
  )
}
