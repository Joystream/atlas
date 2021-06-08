import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'
import { sub } from 'date-fns'
import React from 'react'

import useVideosConnection from '@/api/hooks/videosConnection'
import { ErrorFallback, CoverVideo, InfiniteVideoGrid, InterruptedVideosGallery, ViewWrapper } from '@/components'
import { usePersonalData } from '@/hooks'
import { transitions } from '@/shared/theme'

const MIN_FOLLOWED_CHANNELS_VIDEOS = 16
// last three months
const MIN_DATE_FOLLOWED_CHANNELS_VIDEOS = sub(new Date(), { months: 3 })

const HomeView: React.FC = () => {
  const {
    state: { followedChannels },
  } = usePersonalData()

  const channelIdIn = followedChannels.map((channel) => channel.id)
  const anyFollowedChannels = channelIdIn.length > 0

  const { videosConnection, loading, error } = useVideosConnection(
    {
      where: {
        channelId_in: channelIdIn,
        createdAt_gte: MIN_DATE_FOLLOWED_CHANNELS_VIDEOS,
      },
    },
    { skip: !anyFollowedChannels }
  )

  const followedChannelsVideosCount = videosConnection?.totalCount
  const shouldShowFollowedChannels =
    followedChannelsVideosCount && followedChannelsVideosCount > MIN_FOLLOWED_CHANNELS_VIDEOS

  if (error) {
    throw error
  }
  return (
    <ViewWrapper>
      <CoverVideo />
      <Container className={transitions.names.slide}>
        <InterruptedVideosGallery />
        <ErrorBoundary fallback={ErrorFallback}>
          <StyledInfiniteVideoGrid
            title={shouldShowFollowedChannels ? 'Recent Videos From Followed Channels' : 'Recent Videos'}
            channelIdIn={shouldShowFollowedChannels ? channelIdIn : null}
            createdAtGte={shouldShowFollowedChannels ? MIN_DATE_FOLLOWED_CHANNELS_VIDEOS : null}
            ready={!loading}
          />
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
`

export default HomeView
