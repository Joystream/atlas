import React from 'react'

import { InfiniteChannelWithVideosGrid } from '@/components/InfiniteGrids'
import { DiscoverChannels } from '@/components/_content/DiscoverChannels'
import { TopTenChannels } from '@/components/_content/TopTenChannels'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'

export const ChannelsView: React.FC = () => {
  return (
    <VideoContentTemplate title="Browse channels" cta={['popular', 'new', 'home']}>
      <TopTenChannels />
      <DiscoverChannels />
      <InfiniteChannelWithVideosGrid title="Channels in your language" languageSelector onDemand />
    </VideoContentTemplate>
  )
}
