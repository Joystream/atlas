import React from 'react'

import { usePromisingChannels } from '@/api/hooks'
import { ChannelOrderByInput } from '@/api/queries'
import { InfiniteChannelWithVideosGrid } from '@/components/InfiniteGrids'
import { absoluteRoutes } from '@/config/routes'

const ADDITIONAL_LINK = { name: 'Browse channels', url: absoluteRoutes.viewer.channels() }

export const PromisingNewChannels = () => {
  const { channels } = usePromisingChannels()

  return (
    <InfiniteChannelWithVideosGrid
      title="Promising new channels"
      onDemand
      first={100}
      orderBy={ChannelOrderByInput.CreatedAtDesc}
      additionalLink={ADDITIONAL_LINK}
    />
  )
}
