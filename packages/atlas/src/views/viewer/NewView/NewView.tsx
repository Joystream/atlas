import { FC } from 'react'

import { InfiniteVideoGrid } from '@/components/InfiniteGrids'
import { ExpandableChannelsList } from '@/components/_channel/ExpandableChannelsList'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'

export const NewView: FC = () => {
  const headTags = useHeadTags('New & Noteworthy')

  return (
    <VideoContentTemplate title="New & Noteworthy" cta={['home', 'popular']}>
      {headTags}
      <InfiniteVideoGrid title="Recently uploaded" onDemand />
      <ExpandableChannelsList
        title="Promising new channels"
        queryType="promising"
        additionalLink={{ name: 'Browse channels', url: absoluteRoutes.viewer.channels() }}
      />
    </VideoContentTemplate>
  )
}
