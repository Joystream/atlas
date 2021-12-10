import styled from '@emotion/styled'
import React from 'react'

import { useVideoHeroData, useVideosConnection } from '@/api/hooks'
import { GetMostViewedVideosDocument } from '@/api/queries'
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

  const { videoHero } = useVideoHeroData()

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

  if (followedError) {
    return <ViewErrorFallback />
  }

  return (
    <VideoContentTemplate cta={['popular', 'new', 'channels']}>
      <VideoHero videoHeroData={videoHero} withMuteButton />
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
          timePeriodDays={7}
          query={GetMostViewedVideosDocument}
          title="Popular on Joystream"
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
