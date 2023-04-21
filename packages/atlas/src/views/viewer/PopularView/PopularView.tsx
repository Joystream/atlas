import { FC } from 'react'

import { GetMostViewedVideosConnectionDocument } from '@/api/queries/__generated__/videos.generated'
import { InfiniteVideoGrid } from '@/components/InfiniteGrids'
import { ExpandableChannelsList } from '@/components/_channel/ExpandableChannelsList'
import { TopTenVideos } from '@/components/_content/TopTenVideos'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { CtaData } from '@/types/cta'

const CTA: CtaData[] = ['new', 'home']
const ADDITIONAL_LINK = { name: 'Browse channels', url: absoluteRoutes.viewer.channels() }

export const PopularView: FC = () => {
  const headTags = useHeadTags('Popular')

  return (
    <VideoContentTemplate title={`Popular on ${atlasConfig.general.appName}`} cta={CTA}>
      {headTags}
      <TopTenVideos period="month" />
      <InfiniteVideoGrid title="Popular videos" query={GetMostViewedVideosConnectionDocument} limit={50} onDemand />
      <ExpandableChannelsList title="Popular channels" additionalLink={ADDITIONAL_LINK} queryType="popular" />
    </VideoContentTemplate>
  )
}
