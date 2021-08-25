import React from 'react'

import { DiscoverChannels } from '@/components/DiscoverChannels'
import { InfiniteChannelWithVideosGrid } from '@/components/InfiniteGrids'
import { TopTenChannels } from '@/components/TopTenChannels'
import { VideoContentTemplate } from '@/components/templates/VideoContentTemplate'

export const ChannelsView: React.FC = () => {
  return (
    <VideoContentTemplate title="Browse channels" cta={['popular', 'new', 'home']}>
      <TopTenChannels />
      <DiscoverChannels />
      <InfiniteChannelWithVideosGrid title="Channels in your language" languageSelector onDemand />
    </VideoContentTemplate>
  )
}
