import React from 'react'

import { ChannelOrderByInput } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'

import { InfiniteChannelWithVideosGrid } from './InfiniteGrids'

export const PromisingNewChannels = () => {
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
      sortByViews
    />
  )
}
