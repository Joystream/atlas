import React from 'react'

import { ExpandableChannelsList } from '@/components/_channel/ExpandableChannelsList'
import { absoluteRoutes } from '@/config/routes'

const BROWSE_CHANNELS_LINK = { name: 'Browse channels', url: absoluteRoutes.viewer.channels() }

type DiscoverChannelsProps = {
  withLink?: boolean
}

export const DiscoverChannels: React.FC<DiscoverChannelsProps> = ({ withLink }) => {
  return (
    <ExpandableChannelsList
      title="Discover new channels"
      additionalLink={withLink ? BROWSE_CHANNELS_LINK : undefined}
      queryType="discover"
    />
  )
}
