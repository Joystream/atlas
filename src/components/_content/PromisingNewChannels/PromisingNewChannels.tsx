import React from 'react'

import { usePromisingChannels } from '@/api/hooks'
import { PopularChannelsWithVideoGrid } from '@/components/InfiniteGrids/PopularChannelsWithVideoGrid'
import { absoluteRoutes } from '@/config/routes'

const ADDITIONAL_LINK = { name: 'Browse channels', url: absoluteRoutes.viewer.channels() }

export const PromisingNewChannels = () => {
  const { channels, loading } = usePromisingChannels()

  return (
    <PopularChannelsWithVideoGrid
      title="Promising new channels"
      loading={loading}
      additionalLink={ADDITIONAL_LINK}
      channels={channels}
    />
  )
}
