import React from 'react'

import { InfiniteVideoGrid } from '@/components/InfiniteGrids'
import { ExpandableChannelsList } from '@/components/_channel/ExpandableChannelsList'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'

export const NewView: React.FC = () => {
  const headTags = useHeadTags('New & Noteworthy')

  return (
    <VideoContentTemplate title="New & Noteworthy" cta={['home', 'channels', 'popular']}>
      {headTags}
      <InfiniteVideoGrid title="Videos worth watching" videoWhereInput={{ isFeatured_eq: true }} onDemand titleLoader />
      <ExpandableChannelsList
        title="Promising new channels"
        queryType="promising"
        additionalLink={{ name: 'Browse channels', url: absoluteRoutes.viewer.channels() }}
      />
    </VideoContentTemplate>
  )
}
