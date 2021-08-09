import styled from '@emotion/styled'
import React, { FC } from 'react'

import { useMostViewedVideosAllTimeIds } from '@/api/hooks'
import { useMostViewedVideos } from '@/api/hooks'
import { useMostViewedChannelsAllTimeIds } from '@/api/hooks'
import { InfiniteChannelWithVideosGrid, InfiniteVideoGrid, VideoGallery, ViewWrapper } from '@/components'
import { absoluteRoutes } from '@/config/routes'
import { CallToActionButton, CallToActionWrapper, Text } from '@/shared/components'
import { SvgNavChannels, SvgNavHome, SvgNavNew } from '@/shared/icons'
import { sizes } from '@/shared/theme'

export const PopularView: FC = () => {
  const {
    mostViewedVideosAllTime,
    loading: mostViewedVideosLoading,
    error: mostViewedVideosError,
  } = useMostViewedVideosAllTimeIds({
    limit: 200,
  })
  const mostViewedVideosIds = mostViewedVideosAllTime?.map((item) => item.id)
  const { mostViewedChannelsAllTime } = useMostViewedChannelsAllTimeIds({ limit: 15 })
  const mostViewedChannelsAllTimeIds = mostViewedChannelsAllTime?.map((item) => item.id)
  const { videos, loading } = useMostViewedVideos({ viewedWithinDays: 30, limit: 10 })

  if (mostViewedVideosError) {
    throw mostViewedVideosError
  }

  return (
    <StyledViewWrapper>
      <Header variant="h2">Popular</Header>
      <StyledVideoGallery hasRanking title="Top 10 this month" videos={videos || []} loading={loading} />
      <StyledInfiniteVideoGrid
        title="Popular videos"
        idIn={mostViewedVideosIds}
        ready={!mostViewedVideosLoading}
        onDemand
      />
      <InfiniteChannelWithVideosGrid
        title="Popular channels"
        onDemand
        idIn={mostViewedChannelsAllTimeIds}
        additionalLink={{ name: 'Browse channels', url: absoluteRoutes.viewer.channels() }}
      />
      <CallToActionWrapper>
        <CallToActionButton
          label="New & Noteworthy"
          to={absoluteRoutes.viewer.new()}
          colorVariant="green"
          icon={<SvgNavNew />}
        />
        <CallToActionButton
          label="Home"
          to={absoluteRoutes.viewer.index()}
          colorVariant="yellow"
          icon={<SvgNavHome />}
        />
        <CallToActionButton
          label="Browse channels"
          to={absoluteRoutes.viewer.channels()}
          colorVariant="blue"
          icon={<SvgNavChannels />}
        />
      </CallToActionWrapper>
    </StyledViewWrapper>
  )
}

const Header = styled(Text)`
  margin: ${sizes(16)} 0;
`

const StyledVideoGallery = styled(VideoGallery)`
  margin-bottom: ${sizes(38)};
`

const StyledViewWrapper = styled(ViewWrapper)`
  padding-bottom: ${sizes(10)};
`

const StyledInfiniteVideoGrid = styled(InfiniteVideoGrid)`
  :not(:last-of-type) {
    margin-bottom: ${sizes(38)};
  }
`
