import styled from '@emotion/styled'
import React from 'react'

import { useMostViewedVideosIds, useVideosConnection } from '@/api/hooks'
import {
  DiscoverChannels,
  InfiniteVideoGrid,
  LimitedWidthContainer,
  OfficialJoystreamUpdate,
  TopTenThisWeek,
  VideoHero,
  ViewErrorFallback,
} from '@/components'
import { absoluteRoutes } from '@/config/routes'
import { usePersonalDataStore } from '@/providers'
import { CallToActionButton, CallToActionWrapper } from '@/shared/components'
import { SvgNavChannels, SvgNavNew, SvgNavPopular } from '@/shared/icons'
import { sizes, transitions } from '@/shared/theme'
import { SentryLogger } from '@/utils/logs'

export const HomeView: React.FC = () => {
  const followedChannels = usePersonalDataStore((state) => state.followedChannels)

  const channelIdIn = followedChannels.map((channel) => channel.id)
  const anyFollowedChannels = channelIdIn.length > 0

  const { mostViewedVideos, loading: mostViewedVideosLoading, error: mostViewedVideosError } = useMostViewedVideosIds({
    limit: 200,
    viewedWithinDays: 30,
  })
  const mostViewedVideosIds = mostViewedVideos?.map((item) => item.id)

  const { videosConnection, loading: followedLoading, error: followedError } = useVideosConnection(
    {
      where: {
        channelId_in: channelIdIn,
      },
    },
    { skip: !anyFollowedChannels, onError: (error) => SentryLogger.error('Failed to fetch videos', 'HomeView', error) }
  )

  const followedChannelsVideosCount = videosConnection?.totalCount

  if (mostViewedVideosError || followedError) {
    return <ViewErrorFallback />
  }

  return (
    <LimitedWidthContainer big>
      <VideoHero />
      <Container className={transitions.names.slide}>
        {!followedLoading && followedChannelsVideosCount ? (
          <InfiniteVideoGrid title="Followed channels" channelIdIn={channelIdIn} ready={!followedLoading} onDemand />
        ) : null}
        <InfiniteVideoGrid
          title="Popular on Joystream"
          idIn={mostViewedVideosIds}
          ready={!mostViewedVideosLoading}
          onDemand
        />
        <TopTenThisWeek />
        <OfficialJoystreamUpdate />
        <DiscoverChannels additionalLink={{ name: 'Browse channels', url: absoluteRoutes.viewer.channels() }} />
        <InfiniteVideoGrid title="All content" onDemand />
        <CallToActionWrapper>
          <CallToActionButton
            label="Popular on Joystream"
            to={absoluteRoutes.viewer.popular()}
            colorVariant="red"
            icon={<SvgNavPopular />}
          />
          <CallToActionButton
            label="New & Noteworthy"
            to={absoluteRoutes.viewer.new()}
            colorVariant="green"
            icon={<SvgNavNew />}
          />
          <CallToActionButton
            label="Browse channels"
            to={absoluteRoutes.viewer.channels()}
            colorVariant="blue"
            icon={<SvgNavChannels />}
          />
        </CallToActionWrapper>
      </Container>
    </LimitedWidthContainer>
  )
}

const Container = styled.div`
  position: relative;
  padding-bottom: ${sizes(16)};

  > section {
    :not(:first-of-type) {
      margin-top: ${sizes(32)};
    }
  }
`
