import styled from '@emotion/styled'
import React from 'react'

import { useMostViewedVideos } from '@/api/hooks'
import { VideoGallery } from '@/components'
import { sizes } from '@/shared/theme'

export const TopTenThisWeek = () => {
  const { videos, loading } = useMostViewedVideos({ limit: 10, viewedWithinDays: 7 })

  return (
    <Wrapper>
      <VideoGallery title="Top 10 this week" videos={videos || []} loading={loading} hasRanking />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-top: ${sizes(18)};
`
