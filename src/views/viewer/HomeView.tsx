import styled from '@emotion/styled'
import React from 'react'

import useVideosConnection from '@/api/hooks/videosConnection'
import {
  InfiniteVideoGrid,
  LimitedWidthContainer,
  OfficialJoystreamUpdate,
  VideoHero,
  ViewErrorFallback,
} from '@/components'
import { usePersonalDataStore } from '@/providers'
import { transitions } from '@/shared/theme'
import { SentryLogger } from '@/utils/logs'

export const HomeView: React.FC = () => {
  const followedChannels = usePersonalDataStore((state) => state.followedChannels)

  const channelIdIn = followedChannels.map((channel) => channel.id)
  const anyFollowedChannels = channelIdIn.length > 0

  const { videosConnection, loading, error } = useVideosConnection(
    {
      where: {
        channelId_in: channelIdIn,
      },
    },
    { skip: !anyFollowedChannels, onError: (error) => SentryLogger.error('Failed to fetch videos', 'HomeView', error) }
  )

  const followedChannelsVideosCount = videosConnection?.totalCount

  if (error) {
    return <ViewErrorFallback />
  }

  return (
    <LimitedWidthContainer big>
      <VideoHero />
      <Container className={transitions.names.slide}>
        {!loading && followedChannelsVideosCount ? (
          <StyledInfiniteVideoGrid title="Followed channels" channelIdIn={channelIdIn} ready={!loading} onDemand />
        ) : null}
        <OfficialJoystreamUpdate />
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
`
