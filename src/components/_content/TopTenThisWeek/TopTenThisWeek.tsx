import React from 'react'

import { useMostViewedVideos } from '@/api/hooks'
import { AssetAvailability } from '@/api/queries'
import { VideoGallery } from '@/components/_video/VideoGallery'

export const TopTenThisWeek = () => {
  const { videos, loading } = useMostViewedVideos({
    limit: 10,
    timePeriodDays: 7,
    where: {
      mediaAvailability_eq: AssetAvailability.Accepted,
      thumbnailPhotoAvailability_eq: AssetAvailability.Accepted,
      isPublic_eq: true,
    },
  })

  const sortedTopTenVideos = videos && [...videos]?.sort((a, b) => (b.views || 0) - (a.views || 0))

  return (
    <section>
      <VideoGallery title="Top 10 this week" videos={sortedTopTenVideos} loading={loading} hasRanking />
    </section>
  )
}
