import styled from '@emotion/styled'
import React from 'react'

import { useMostViewedVideosIds, useVideosConnection } from '@/api/hooks'
import {
  InfiniteVideoGrid,
  LimitedWidthContainer,
  OfficialJoystreamUpdate,
  VideoHero,
  ViewErrorFallback,
} from '@/components'
import { usePersonalDataStore } from '@/providers'
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
          <StyledInfiniteVideoGrid
            title="Followed channels"
            channelIdIn={channelIdIn}
            ready={!followedLoading}
            onDemand
          />
        ) : null}
        {!mostViewedVideosLoading && mostViewedVideos?.length ? (
          <StyledInfiniteVideoGrid
            title="Popular on Joystream"
            idIn={mostViewedVideosIds}
            ready={!mostViewedVideosLoading}
            onDemand
          />
        ) : null}
        <OfficialJoystreamUpdate />
        <StyledInfiniteVideoGrid title="All content" onDemand />
      </Container>
    </LimitedWidthContainer>
  )
}

const Container = styled.div`
  position: relative;

  & > * {
    margin-bottom: 3rem;
  }
`

const StyledInfiniteVideoGrid = styled(InfiniteVideoGrid)`
  margin: 0;
  padding-bottom: 4rem;

  :not(:first-of-type) {
    margin-top: ${sizes(36)};
  }
`
