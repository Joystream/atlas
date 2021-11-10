import React from 'react'

import { InfiniteVideoGrid } from '@/components/InfiniteGrids'
import { PromisingNewChannels } from '@/components/PromisingNewChannels'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'

export const NewView: React.FC = () => (
  <VideoContentTemplate title="New & Noteworthy" cta={['home', 'channels', 'popular']}>
    <InfiniteVideoGrid title="Videos worth watching" videoWhereInput={{ isFeatured_eq: true }} onDemand titleLoader />
    <PromisingNewChannels />
  </VideoContentTemplate>
)
