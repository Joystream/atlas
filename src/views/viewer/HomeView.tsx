import styled from '@emotion/styled'
import { sub } from 'date-fns'
import React from 'react'

import useVideosConnection from '@/api/hooks/videosConnection'
import { InfiniteVideoGrid, InterruptedVideosGallery, VideoHero, ViewErrorFallback, ViewWrapper } from '@/components'
import { usePersonalDataStore } from '@/providers'
import { transitions } from '@/shared/theme'
import { Logger } from '@/utils/logger'

const MIN_FOLLOWED_CHANNELS_VIDEOS = 16
// last three months
const MIN_DATE_FOLLOWED_CHANNELS_VIDEOS = sub(new Date(), { months: 3 })

export const HomeView: React.FC = () => {
  const followedChannels = usePersonalDataStore((state) => state.followedChannels)

  const channelIdIn = followedChannels.map((channel) => channel.id)
  const anyFollowedChannels = channelIdIn.length > 0

  const { videosConnection, loading, error } = useVideosConnection(
    {
      where: {
        channelId_in: channelIdIn,
        createdAt_gte: MIN_DATE_FOLLOWED_CHANNELS_VIDEOS,
      },
    },
    { skip: !anyFollowedChannels, onError: (error) => Logger.captureError('Failed to fetch videos', 'HomeView', error) }
  )

  const followedChannelsVideosCount = videosConnection?.totalCount
  const shouldShowFollowedChannels =
    followedChannelsVideosCount && followedChannelsVideosCount > MIN_FOLLOWED_CHANNELS_VIDEOS

  if (error) {
    return <ViewErrorFallback />
  }

  return (
    <ViewWrapper>
      <VideoHero />
      <Container className={transitions.names.slide}>
        <InterruptedVideosGallery />
        <StyledInfiniteVideoGrid
          title={shouldShowFollowedChannels ? 'Recent Videos From Followed Channels' : 'Recent Videos'}
          channelIdIn={shouldShowFollowedChannels ? channelIdIn : null}
          createdAtGte={shouldShowFollowedChannels ? MIN_DATE_FOLLOWED_CHANNELS_VIDEOS : null}
          ready={!loading}
        />
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
