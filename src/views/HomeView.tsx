import React from 'react'
import styled from '@emotion/styled'
import { ErrorBoundary } from '@sentry/react'
import { ErrorFallback, CoverVideo, InfiniteVideoGrid, InterruptedVideosGallery } from '@/components'
import { usePersonalData } from '@/hooks'
import { sub } from 'date-fns'
import useVideosConnection from '@/api/hooks/videosConnection'

const MIN_FOLLOWED_CHANNELS_VIDEOS = 16
// last three months
const MIN_DATE_FOLLOWED_CHANNELS_VIDEOS = sub(new Date(), { months: 3 })

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
  const shouldShowFollowedChannels =
    followedChannelsVideosCount && followedChannelsVideosCount > MIN_FOLLOWED_CHANNELS_VIDEOS
  return (
    <>
      <CoverVideo />
      <Container>
        <InterruptedVideosGallery />
        <ErrorBoundary fallback={ErrorFallback}>
          <StyledInfiniteVideoGrid
            title={shouldShowFollowedChannels ? 'Recent Videos From Followed Channels' : 'Recent Videos'}
            isTitleLoading={loading}
            channelIdIn={shouldShowFollowedChannels ? channelIdIn : null}
            createdAtGte={shouldShowFollowedChannels ? MIN_DATE_FOLLOWED_CHANNELS_VIDEOS : null}
            ready={!loading}
          />
        </ErrorBoundary>
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

export default HomeView
