import React from 'react'
import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'
import {
  ErrorFallback,
  CoverVideo,
  InfiniteVideoGrid,
  InterruptedVideosGallery,
  InfiniteFollowedChannelsVideoGrid,
} from '@/components'
import { usePersonalData } from '@/hooks'
import { sub } from 'date-fns'
import useVideosConnection from '@/api/hooks/videosConnection'

const MIN_FOLLOWED_CHANNELS_VIDEOS = 16

// last three months
const MIN_DATE_FOLLOWED_CHANNELS_VIDEOS = sub(new Date(), { months: 90 })

const HomeView: React.FC = () => {
  const {
    state: { followedChannels },
  } = usePersonalData()

  const channelIdIn = followedChannels.map((channel) => channel.id)
  const { videosConnection, loading } = useVideosConnection({
    channelIdIn,
    createdAtGte: MIN_DATE_FOLLOWED_CHANNELS_VIDEOS,
  })

  const followedChannelsVideosCount = videosConnection?.totalCount

  return (
    <>
      <CoverVideo />
      <Container>
        <InterruptedVideosGallery />
        {followedChannelsVideosCount && followedChannelsVideosCount >= MIN_FOLLOWED_CHANNELS_VIDEOS ? (
          <ErrorBoundary fallback={ErrorFallback}>
            <StyledInfiniteFollowedChannelsVideoGrid
              isTitleLoading={loading}
              title="Recent videos from followed channels"
              createdAtGte={MIN_DATE_FOLLOWED_CHANNELS_VIDEOS}
              channelIdIn={channelIdIn}
            />
          </ErrorBoundary>
        ) : (
          <ErrorBoundary fallback={ErrorFallback}>
            <StyledInfiniteVideoGrid title="Recent videos" isTitleLoading={loading} />
          </ErrorBoundary>
        )}
      </Container>
    </>
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
const StyledInfiniteFollowedChannelsVideoGrid = styled(InfiniteFollowedChannelsVideoGrid)`
  margin: 0;
  padding-bottom: 4rem;
`

export default HomeView
