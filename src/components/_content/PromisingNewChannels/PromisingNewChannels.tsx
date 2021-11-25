import React from 'react'

import { ChannelEdge, ChannelOrderByInput, VideoEdge } from '@/api/queries'
import { InfiniteChannelWithVideosGrid } from '@/components/InfiniteGrids'
import { absoluteRoutes } from '@/config/routes'

const ADDITIONAL_LINK = { name: 'Browse channels', url: absoluteRoutes.viewer.channels() }

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
      additionalLink={ADDITIONAL_LINK}
      additionalSortFn={sortChannelsByViewsDesc}
    />
  )
}
