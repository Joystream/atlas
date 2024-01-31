import styled from '@emotion/styled'
import { FC, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { GetHomepageVideosDocument, GetHomepageVideosQuery } from '@/api/queries/__generated__/videos.generated'
import { Section } from '@/components/Section/Section'
import { ReferralsBanner } from '@/components/_referrals/ReferralsBanner/ReferralsBanner'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { publicCryptoVideoFilter } from '@/config/contentFilter'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useInfiniteVideoGrid } from '@/hooks/useInfiniteVideoGrid'
import { getCorrectLoginModal } from '@/providers/auth/auth.helpers'
import { useAuthStore } from '@/providers/auth/auth.store'
import { usePersonalDataStore } from '@/providers/personalData'
import { DEFAULT_VIDEO_GRID, sizes } from '@/styles'
import { InteractionsService } from '@/utils/InteractionsService'
import { InfiniteLoadingOffsets } from '@/utils/loading.contants'

export const HomeView: FC = () => {
  const numberOfPages = useRef(0)
  const location = useLocation()
  const {
    actions: { setAuthModalOpenName },
  } = useAuthStore()
  const {
    actions: { setGlobalRecommendationId },
  } = usePersonalDataStore()

  const headTags = useHeadTags()
  const { columns, fetchMore, tiles, rawData, loading } = useInfiniteVideoGrid<GetHomepageVideosQuery>({
    query: GetHomepageVideosDocument,
    variables: {
      where: publicCryptoVideoFilter,
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
    <VideoContentTemplate>
      <ReferralsBanner />
      {headTags}
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
    </VideoContentTemplate>
  )
}

const StyledSection = styled(Section)`
  padding: ${sizes(8)} 0;
`
