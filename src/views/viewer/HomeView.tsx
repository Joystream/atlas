import styled from '@emotion/styled'
import React from 'react'

import { useMostViewedVideosIds, useVideosConnection } from '@/api/hooks'
import { DiscoverChannels } from '@/components/DiscoverChannels'
import { InfiniteVideoGrid } from '@/components/InfiniteGrids'
import { OfficialJoystreamUpdate } from '@/components/OfficialJoystreamUpdate'
import { TopTenThisWeek } from '@/components/TopTenThisWeek'
import { VideoHero } from '@/components/VideoHero'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { VideoContentTemplate } from '@/components/templates/VideoContentTemplate'
import { absoluteRoutes } from '@/config/routes'
import { usePersonalDataStore } from '@/providers/personalData'
import { sizes, transitions } from '@/shared/theme'
import { SentryLogger } from '@/utils/logs'

export const HomeView: React.FC = () => {
  const followedChannels = usePersonalDataStore((state) => state.followedChannels)

  const channelIdIn = followedChannels.map((channel) => channel.id)
  const anyFollowedChannels = channelIdIn.length > 0

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
      <VideoHero />
      <Container className={transitions.names.slide}>
        {!followedLoading && followedChannelsVideosCount ? (
          <InfiniteVideoGrid
            title="Followed channels"
            channelIdIn={channelIdIn}
            ready={!followedLoading}
            onDemand
            titleLoader
          />
        ) : null}
        <InfiniteVideoGrid
          title="Popular on Joystream"
          idIn={mostViewedVideosIds}
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
  padding-bottom: ${sizes(16)};

  > section {
    :not(:first-of-type) {
      margin-top: ${sizes(32)};
    }
  }
`
