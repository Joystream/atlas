import React from 'react'

import { useMostViewedVideos } from '@/api/hooks'
import { VideoGallery } from '@/components/_video/VideoGallery'

export const TopTenThisWeek = () => {
  const { videos, loading } = useMostViewedVideos({ limit: 10, timePeriodDays: 7 })

  return (
    <section>
      <VideoGallery title="Top 10 this week" videos={videos} loading={loading} hasRanking />
    </section>
  )
}
