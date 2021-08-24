import React from 'react'

import { InfiniteVideoGrid } from '@/components/InfiniteGrids'
import { PromisingNewChannels } from '@/components/PromisingNewChannels'
import { VideoContentTemplate } from '@/components/templates'

export const NewView: React.FC = () => (
  <VideoContentTemplate title="New & Noteworthy" cta={['home', 'channels', 'popular']}>
    <InfiniteVideoGrid title="Videos worth watching" isFeatured onDemand titleLoader />
    <PromisingNewChannels />
  </VideoContentTemplate>
)
