import React, { FC } from 'react'

import { useMostViewedVideosAllTimeIds } from '@/api/hooks'
import { useMostViewedVideos } from '@/api/hooks'
import { useMostViewedChannelsAllTimeIds } from '@/api/hooks'
import { InfiniteChannelWithVideosGrid, InfiniteVideoGrid } from '@/components/InfiniteGrids'
import { VideoGallery } from '@/components/VideoGallery'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { VideoContentTemplate } from '@/components/templates/VideoContentTemplate'
import { absoluteRoutes } from '@/config/routes'
import { SentryLogger } from '@/utils/logs'

export const PopularView: FC = () => {
  const {
    mostViewedVideosAllTime,
    loading: mostViewedVideosLoading,
    error: mostViewedVideosIdsError,
  } = useMostViewedVideosAllTimeIds(
    {
      limit: 200,
    },
    { onError: (error) => SentryLogger.error('Failed to fetch most viewed videos IDs', 'PopularView', error) }
  )
  const mostViewedVideosIds = mostViewedVideosAllTime?.map((item) => item.id)
  const { mostViewedChannelsAllTime, error: mostViewedChannelsError } = useMostViewedChannelsAllTimeIds(
    { limit: 15 },
    { onError: (error) => SentryLogger.error('Failed to fetch most viewed channels IDs', 'PopularView', error) }
  )
  const mostViewedChannelsAllTimeIds = mostViewedChannelsAllTime?.map((item) => item.id)
  const {
    videos,
    loading,
    error: mostViewedVideosError,
  } = useMostViewedVideos(
    { timePeriodDays: 30, limit: 10 },
    { onError: (error) => SentryLogger.error('Failed to fetch videos', 'PopularView', error) }
  )

  if (mostViewedVideosIdsError || mostViewedVideosError || mostViewedChannelsError) {
    return <ViewErrorFallback />
  }

  return (
    <VideoContentTemplate title="Popular on Joystream" cta={['new', 'home', 'channels']}>
      <VideoGallery hasRanking title="Top 10 this month" videos={videos} loading={loading} />
      <InfiniteVideoGrid
        title="Popular videos"
        videoWhereInput={{ id_in: mostViewedVideosIds }}
        ready={!mostViewedVideosLoading}
        onDemand
      />
      <InfiniteChannelWithVideosGrid
        title="Popular channels"
        onDemand
        idIn={mostViewedChannelsAllTimeIds}
        additionalLink={{ name: 'Browse channels', url: absoluteRoutes.viewer.channels() }}
      />
    </VideoContentTemplate>
  )
}
