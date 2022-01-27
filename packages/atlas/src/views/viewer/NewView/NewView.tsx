import React from 'react'

import { InfiniteVideoGrid } from '@/components/InfiniteGrids'
import { ExpandableChannelsList } from '@/components/_channel/ExpandableChannelsList'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { absoluteRoutes } from '@/config/routes'

export const NewView: React.FC = () => (
  <VideoContentTemplate title="New & Noteworthy" cta={['home', 'channels', 'popular']}>
    <InfiniteVideoGrid title="Videos worth watching" videoWhereInput={{ isFeatured_eq: true }} onDemand titleLoader />
    <ExpandableChannelsList
      title="Promising new channels"
      queryType="promising"
      additionalLink={{ name: 'Browse channels', url: absoluteRoutes.viewer.channels() }}
    />
  </VideoContentTemplate>
)
