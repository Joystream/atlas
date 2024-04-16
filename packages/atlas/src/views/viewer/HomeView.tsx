import styled from '@emotion/styled'
import { FC, useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import {
  GetBasicVideosConnectionLightweightDocument,
  GetHomepageVideosDocument,
  GetHomepageVideosQuery,
  useGetCuratedHompageVideosQuery,
} from '@/api/queries/__generated__/videos.generated'
import { Section } from '@/components/Section/Section'
import { ReferralsBanner } from '@/components/_referrals/ReferralsBanner/ReferralsBanner'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { getPublicCryptoVideoFilter } from '@/config/contentFilter'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useInfiniteVideoGrid } from '@/hooks/useInfiniteVideoGrid'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'
import { getCorrectLoginModal } from '@/providers/auth/auth.helpers'
import { useAuthStore } from '@/providers/auth/auth.store'
import { usePersonalDataStore } from '@/providers/personalData'
import { DEFAULT_VIDEO_GRID, sizes } from '@/styles'
import { InteractionsService } from '@/utils/InteractionsService'
import { createPlaceholderData } from '@/utils/data'
import { InfiniteLoadingOffsets } from '@/utils/loading.contants'

export const supporting_recommendations = false
export const HomeView: FC = () => {
  const headTags = useHeadTags()

  return (
    <VideoContentTemplate>
      <ReferralsBanner />
      {headTags}
      {supporting_recommendations ? <RecommendationBasedHomepage /> : <DefaultHomepage />}
    </VideoContentTemplate>
  )
}

const DefaultHomepage = () => {
  const { columns, fetchMore, tiles, loading, pageInfo } = useHomeVideos()

  return (
    <StyledSection
      contentProps={{
        type: 'grid',
        grid: DEFAULT_VIDEO_GRID,
        children: tiles?.map((video) => (
          <VideoTileViewer
            id={video.id}
            key={video.id}
            onClick={() => {
              if (video.id) {
                InteractionsService.videoClicked(video.id)
              }
            }}
            onChannelClick={() => {
              if ('channel' in video && video?.channel.id) {
                InteractionsService.channelClicked(video.channel.id)
              }
            }}
          />
        )),
      }}
      footerProps={{
        reachedEnd: !pageInfo?.hasNextPage,
        fetchMore: async () => {
          if (!loading) {
            await fetchMore({
              variables: { first: columns * 4, after: pageInfo?.endCursor },
            })
          }
          return
        },
        type: 'infinite',
        loadingTriggerOffset: InfiniteLoadingOffsets.VideoTile,
      }}
    />
  )
}

const RecommendationBasedHomepage = () => {
  const numberOfPages = useRef(0)
  const location = useLocation()
  const {
    actions: { setAuthModalOpenName },
  } = useAuthStore()
  const {
    actions: { setGlobalRecommendationId },
  } = usePersonalDataStore()

  const { columns, fetchMore, tiles, rawData, loading } = useInfiniteVideoGrid<GetHomepageVideosQuery>({
    query: GetHomepageVideosDocument,
    variables: {
      where: getPublicCryptoVideoFilter(),
      orderBy: [VideoOrderByInput.VideoRelevanceDesc],
    },
  })

  useEffect(() => {
    if (location.state?.['redirectTo']) {
      setAuthModalOpenName(getCorrectLoginModal())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <StyledSection
      contentProps={{
        type: 'grid',
        grid: DEFAULT_VIDEO_GRID,
        children: tiles?.map((video) => (
          <VideoTileViewer
            id={video.id}
            key={video.id}
            onClick={() => {
              if (video.id) {
                InteractionsService.videoClicked(video.id, { recommId: rawData.homepageVideos.recommId })
                setGlobalRecommendationId(rawData.homepageVideos.recommId)
              }
            }}
            onChannelClick={() => {
              if ('channel' in video && video?.channel.id) {
                InteractionsService.channelClicked(video.channel.id)
                setGlobalRecommendationId(rawData.homepageVideos.recommId)
              }
            }}
          />
        )),
      }}
      footerProps={{
        reachedEnd: loading || !(numberOfPages.current < 20),
        fetchMore: async () => {
          if (!loading && numberOfPages.current < 20) {
            fetchMore({
              variables: { prevRecommId: rawData.homepageVideos.recommId, limit: columns * 4 },
              updateQuery: (prev, { fetchMoreResult }) => {
                fetchMoreResult.homepageVideos.video = [
                  ...(prev.homepageVideos?.video ?? []),
                  ...fetchMoreResult.homepageVideos.video,
                ]
                return fetchMoreResult
              },
            }).then(() => {
              numberOfPages.current++
            })
          }
        },
        type: 'infinite',
        loadingTriggerOffset: InfiniteLoadingOffsets.VideoTile,
      }}
    />
  )
}

const StyledSection = styled(Section)`
  padding: ${sizes(8)} 0;
`

const useHomeVideos = () => {
  const initialRowsToLoad = useVideoGridRows('main')
  const { data, loading } = useGetCuratedHompageVideosQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      where: getPublicCryptoVideoFilter({
        orionLanguage_in: undefined,
        includeInHomeFeed_eq: true,
      }),
      skipVideoIds: ['-1'],
    },
  })
  const avoidIds = data?.dumbPublicFeedVideos ? data.dumbPublicFeedVideos?.map((video) => video.id) : undefined
  const { columns, fetchMore, pageInfo, tiles } = useInfiniteVideoGrid({
    query: GetBasicVideosConnectionLightweightDocument,
    variables: {
      where: getPublicCryptoVideoFilter({
        id_not_in: avoidIds,
      }),
      orderBy: VideoOrderByInput.VideoRelevanceDesc,
    },
    options: {
      skip: !avoidIds,
    },
  })

  const firstLoad = !data?.dumbPublicFeedVideos && loading
  const firstLoadPlaceholders = firstLoad ? createPlaceholderData(columns * initialRowsToLoad) : []

  const displayedItems = [...(data?.dumbPublicFeedVideos || []), ...(tiles || [])]

  return {
    tiles: [...firstLoadPlaceholders, ...displayedItems],
    fetchMore,
    columns,
    loading,
    pageInfo,
  }
}
