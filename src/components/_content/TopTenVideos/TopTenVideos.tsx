import React from 'react'

import { useTop10VideosThisMonth, useTop10VideosThisWeek } from '@/api/hooks'
import { VideoGallery } from '@/components/_video/VideoGallery'
import { SentryLogger } from '@/utils/logs'

type TopTenVideosProps = {
  period: 'week' | 'month'
}

export const TopTenVideos: React.FC<TopTenVideosProps> = ({ period }) => {
  const queryFn = period === 'week' ? useTop10VideosThisWeek : useTop10VideosThisMonth
  const { videos, loading } = queryFn(
    {},
    { onError: (error) => SentryLogger.error('Failed to fetch most viewed videos', 'TopTenVideos', error) }
  )

  return (
    <section>
      <VideoGallery title={`Top 10 this ${period}`} videos={videos} loading={loading} hasRanking />
    </section>
  )
}
