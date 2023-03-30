import styled from '@emotion/styled'
import { FC } from 'react'

import { useVideoHeroData } from '@/api/hooks/videoHero'
import { useBasicVideosConnection } from '@/api/hooks/videosConnection'
import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { GetMostViewedVideosConnectionDocument } from '@/api/queries/__generated__/videos.generated'
import { SvgActionAuction, SvgActionCalendar, SvgActionClock, SvgActionSettings } from '@/assets/icons'
import { InfiniteVideoGrid } from '@/components/InfiniteGrids'
import { SectionHeader } from '@/components/Section/SectionHeader'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { DiscoverChannels } from '@/components/_content/DiscoverChannels'
import { NewNftSales } from '@/components/_content/NewNftSales'
import { OfficialJoystreamUpdate } from '@/components/_content/OfficialJoystreamUpdate'
import { TopTenVideos } from '@/components/_content/TopTenVideos'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { VideoHero } from '@/components/_video/VideoHero'
import { atlasConfig } from '@/config'
import { publicVideoFilter } from '@/config/contentFilter'
import { useHeadTags } from '@/hooks/useHeadTags'
import { usePersonalDataStore } from '@/providers/personalData'
import { sizes, transitions } from '@/styles'
import { SentryLogger } from '@/utils/logs'

export const HomeView: FC = () => {
  const followedChannels = usePersonalDataStore((state) => state.followedChannels)

  const channelIdIn = followedChannels.map((channel) => channel.id)
  const anyFollowedChannels = channelIdIn.length > 0

  const { videoHero, loading } = useVideoHeroData()

  const {
    videosConnection,
    loading: followedLoading,
    error: followedError,
  } = useBasicVideosConnection(
    {
      where: {
        ...publicVideoFilter,
        channel: {
          id_in: channelIdIn,
        },
      },
    },
    { skip: !anyFollowedChannels, onError: (error) => SentryLogger.error('Failed to fetch videos', 'HomeView', error) }
  )

  const headTags = useHeadTags()

  const followedChannelsVideosCount = videosConnection?.totalCount

  return (
    <SectionHeader
      start={{
        type: 'title',
        title: 'Custom title',
        nodeStart: {
          type: 'custom',
          node: <div style={{ width: 24, height: 24, background: 'blue', borderRadius: 5 }} />,
        },
      }}
      sort={{
        type: 'select',
        selectProps: {
          items: [{ name: 'hello', value: 'hello' }],
        },
      }}
      filters={[
        {
          label: 'Date uploaded',
          icon: <SvgActionCalendar />,
          onApply: () => null,
          options: [],
        },
        {
          label: 'Length',
          icon: <SvgActionClock />,
          onApply: () => null,
          options: [],
        },
        {
          label: 'Auction type',
          icon: <SvgActionAuction />,
          onApply: () => null,
          options: [],
        },
        {
          label: 'Other filters',
          icon: <SvgActionSettings />,
          onApply: () => null,
          options: [],
        },
      ]}
      search={{}}
    />
  )

  if (followedError) {
    return <ViewErrorFallback />
  }

  return (
    <VideoContentTemplate cta={['popular', 'new', 'channels']}>
      {headTags}
      <VideoHero videoHeroData={videoHero} withMuteButton loading={loading} />
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
          orderBy={[VideoOrderByInput.CreatedAtDesc, VideoOrderByInput.ViewsNumDesc]}
          query={GetMostViewedVideosConnectionDocument}
          title={`Popular on ${atlasConfig.general.appName}`}
          onDemand
          titleLoader
        />
        <NewNftSales />
        <TopTenVideos period="week" />
        <OfficialJoystreamUpdate />
        <DiscoverChannels withLink />
        <InfiniteVideoGrid title="All content" onDemand queryOpts={{ context: { delay: 2000 } }} />
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
