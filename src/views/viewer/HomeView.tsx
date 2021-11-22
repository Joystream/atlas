import styled from '@emotion/styled'
import React from 'react'

import { useVideoHeroData } from '@/api/featured'
import { useMostViewedVideosIds, useVideosConnection } from '@/api/hooks'
import { InfiniteVideoGrid } from '@/components/InfiniteGrids'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { DiscoverChannels } from '@/components/_content/DiscoverChannels'
import { OfficialJoystreamUpdate } from '@/components/_content/OfficialJoystreamUpdate'
import { TopTenThisWeek } from '@/components/_content/TopTenThisWeek'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { VideoHero } from '@/components/_video/VideoHero'
import { absoluteRoutes } from '@/config/routes'
import { usePersonalDataStore } from '@/providers/personalData'
import { sizes, transitions } from '@/styles'
import { SentryLogger } from '@/utils/logs'

export const HomeView: React.FC = () => {
  const followedChannels = usePersonalDataStore((state) => state.followedChannels)

  const channelIdIn = followedChannels.map((channel) => channel.id)
  const anyFollowedChannels = channelIdIn.length > 0

  const videoHeroData = useVideoHeroData()

  const {
    mostViewedVideos,
    loading: mostViewedVideosLoading,
    error: mostViewedVideosError,
  } = useMostViewedVideosIds(
    {
      limit: 200,
      timePeriodDays: 30,
    },
    { onError: (error) => SentryLogger.error('Failed to fetch most viewed videos IDs', 'HomeView', error) }
  )
  const mostViewedVideosIds = mostViewedVideos?.map((item) => item.id)

  const {
    videosConnection,
    loading: followedLoading,
    error: followedError,
  } = useVideosConnection(
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
    <VideoContentTemplate cta={['popular', 'new', 'channels']}>
      <VideoHero videoHeroData={videoHeroData} withMuteButton />
      <Container className={transitions.names.slide}>
        {!followedLoading && followedChannelsVideosCount ? (
          <InfiniteVideoGrid
            title="Followed channels"
            videoWhereInput={{ channelId_in: channelIdIn }}
            ready={!followedLoading}
            onDemand
            titleLoader
          />
        ) : null}
        <InfiniteVideoGrid
          title="Popular on Joystream"
          videoWhereInput={{ id_in: mostViewedVideosIds }}
          ready={!mostViewedVideosLoading}
          onDemand
          titleLoader
        />
        <TopTenThisWeek />
        <OfficialJoystreamUpdate />
        <DiscoverChannels additionalLink={{ name: 'Browse channels', url: absoluteRoutes.viewer.channels() }} />
        <InfiniteVideoGrid title="All content" onDemand />
      </Container>
    </VideoContentTemplate>
  )
}

const Container = styled.div`
  position: relative;
  padding: ${sizes(16)} 0;

  > section {
    :not(:first-of-type) {
      margin-top: ${sizes(32)};
    }
  }
`
