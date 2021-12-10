import React from 'react'

import { useMostViewedVideos } from '@/api/hooks'
import { VideoGallery } from '@/components/_video/VideoGallery'

export const TopTenThisWeek = () => {
  const { videos, loading } = useMostViewedVideos({ limit: 10, timePeriodDays: 7 })

  const sortedTopTenVideos = videos && [...videos]?.sort((a, b) => (b.views || 0) - (a.views || 0))

  return (
    <section>
      <VideoGallery title="Top 10 this week" videos={sortedTopTenVideos} loading={loading} hasRanking />
    </section>
  )
}
