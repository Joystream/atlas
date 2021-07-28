import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'
import React from 'react'

import useVideosConnection from '@/api/hooks/videosConnection'
import { CoverVideo, ErrorFallback, InfiniteVideoGrid, OfficialJoystreamUpdate, ViewWrapper } from '@/components'
import { absoluteRoutes } from '@/config/routes'
import { usePersonalDataStore } from '@/providers'
import { CallToActionButton, CallToActionWrapper } from '@/shared/components'
import { SvgNavChannels, SvgNavNew, SvgNavPopular } from '@/shared/icons'
import { sizes, transitions } from '@/shared/theme'

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
    { skip: !anyFollowedChannels }
  )

  const followedChannelsVideosCount = videosConnection?.totalCount

  if (error) {
    throw error
  }

  return (
    <ViewWrapper>
      <CoverVideo />
      <Container className={transitions.names.slide}>
        <ErrorBoundary fallback={ErrorFallback}>
          {!loading && followedChannelsVideosCount ? (
            <StyledInfiniteVideoGrid title="Followed channels" channelIdIn={channelIdIn} ready={!loading} onDemand />
          ) : null}
          <OfficialJoystreamUpdate />
          <StyledInfiniteVideoGrid title="All content" onDemand />
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
        </ErrorBoundary>
      </Container>
    </ViewWrapper>
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
