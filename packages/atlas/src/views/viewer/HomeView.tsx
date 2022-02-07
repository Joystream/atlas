import styled from '@emotion/styled'
import React from 'react'

import { useVideoHeroData, useVideosConnection } from '@/api/hooks'
import { GetMostViewedVideosConnectionDocument } from '@/api/queries'
import { InfiniteVideoGrid } from '@/components/InfiniteGrids'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { DiscoverChannels } from '@/components/_content/DiscoverChannels'
import { OfficialJoystreamUpdate } from '@/components/_content/OfficialJoystreamUpdate'
import { TopTenVideos } from '@/components/_content/TopTenVideos'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { VideoHero } from '@/components/_video/VideoHero'
import { useHeadTags } from '@/hooks/useHeadTags'
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
        channel: {
          id_in: channelIdIn,
        },
      },
    },
    { skip: !anyFollowedChannels, onError: (error) => SentryLogger.error('Failed to fetch videos', 'HomeView', error) }
  )

  const headTags = useHeadTags()

  const followedChannelsVideosCount = videosConnection?.totalCount

  if (followedError) {
    return <ViewErrorFallback />
  }

  return (
    <VideoContentTemplate cta={['popular', 'new', 'channels']}>
      {headTags}
      <VideoHero videoHeroData={videoHero} withMuteButton />
      <Container className={transitions.names.slide}>
        {!followedLoading && followedChannelsVideosCount ? (
          <InfiniteVideoGrid
            title="Followed channels"
            videoWhereInput={{ channel: { id_in: channelIdIn } }}
            ready={!followedLoading}
            onDemand
            titleLoader
          />
        ) : null}
        <InfiniteVideoGrid
          periodDays={7}
          query={GetMostViewedVideosConnectionDocument}
          title="Popular on Joystream"
          onDemand
          titleLoader
        />
        <TopTenVideos period="week" />
        <OfficialJoystreamUpdate />
        <DiscoverChannels withLink />
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
