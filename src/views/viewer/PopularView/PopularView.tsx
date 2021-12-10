import React, { FC } from 'react'

import { useMostViewedChannelsAllTime, useMostViewedVideos } from '@/api/hooks'
import { GetMostViewedChannelsAllTimeDocument, GetMostViewedVideosAllTimeDocument } from '@/api/queries'
import { InfiniteChannelWithVideosGrid, InfiniteVideoGrid } from '@/components/InfiniteGrids'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { VideoGallery } from '@/components/_video/VideoGallery'
import { absoluteRoutes } from '@/config/routes'
import { CtaData } from '@/types/cta'
import { SentryLogger } from '@/utils/logs'

const CTA: CtaData[] = ['new', 'home', 'channels']
const ADDITIONAL_LINK = { name: 'Browse channels', url: absoluteRoutes.viewer.channels() }

export const PopularView: FC = () => {
  const {
    videos,
    loading,
    error: mostViewedVideosError,
  } = useMostViewedVideos(
    { timePeriodDays: 30, limit: 10 },
    { onError: (error) => SentryLogger.error('Failed to fetch most viewed videos', 'PopularView', error) }
  )

  if (mostViewedVideosError) {
    return <ViewErrorFallback />
  }

  const sortedTopTenVideos = videos && [...videos]?.sort((a, b) => (b.views || 0) - (a.views || 0))

  return (
    <VideoContentTemplate title="Popular on Joystream" cta={CTA}>
      <VideoGallery hasRanking title="Top 10 this month" videos={sortedTopTenVideos} loading={loading} />
      <InfiniteVideoGrid title="Popular videos" query={GetMostViewedVideosAllTimeDocument} limit={50} onDemand />
      <InfiniteChannelWithVideosGrid
        title="Popular channels"
        onDemand
        query={GetMostViewedChannelsAllTimeDocument}
        additionalLink={ADDITIONAL_LINK}
      />
    </VideoContentTemplate>
  )
}
