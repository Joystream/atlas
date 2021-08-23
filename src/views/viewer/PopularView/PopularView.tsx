import styled from '@emotion/styled'
import React, { FC } from 'react'

import { useMostViewedVideosAllTimeIds } from '@/api/hooks'
import { useMostViewedVideos } from '@/api/hooks'
import { useMostViewedChannelsAllTimeIds } from '@/api/hooks'
import { InfiniteChannelWithVideosGrid, InfiniteVideoGrid } from '@/components/InfiniteGrids'
import { VideoGallery } from '@/components/VideoGallery'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { ViewWrapper } from '@/components/ViewWrapper'
import { absoluteRoutes } from '@/config/routes'
import { CallToActionButton, CallToActionWrapper } from '@/shared/components/CallToActionButton'
import { Text } from '@/shared/components/Text'
import { SvgNavChannels, SvgNavHome, SvgNavNew } from '@/shared/icons'
import { sizes } from '@/shared/theme'
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
  const { videos, loading, error: mostViewedVideosError } = useMostViewedVideos(
    { timePeriodDays: 30, limit: 10 },
    { onError: (error) => SentryLogger.error('Failed to fetch videos', 'PopularView', error) }
  )

  if (mostViewedVideosIdsError || mostViewedVideosError || mostViewedChannelsError) {
    return <ViewErrorFallback />
  }

  return (
    <StyledViewWrapper>
      <Header variant="h2">Popular on Joystream</Header>
      <VideoGallery hasRanking title="Top 10 this month" videos={videos} loading={loading} />
      <InfiniteVideoGrid title="Popular videos" idIn={mostViewedVideosIds} ready={!mostViewedVideosLoading} onDemand />
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
  margin: ${sizes(17)} 0;
`

const StyledViewWrapper = styled(ViewWrapper)`
  padding-bottom: ${sizes(16)};

  > section {
    :not(:first-of-type) {
      margin-top: ${sizes(32)};
    }
  }
`
