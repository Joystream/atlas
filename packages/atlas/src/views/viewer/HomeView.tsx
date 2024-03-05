import styled from '@emotion/styled'
import { FC } from 'react'

import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import {
  GetBasicVideosConnectionLightweightDocument,
  useGetCuratedHompageVideosQuery,
} from '@/api/queries/__generated__/videos.generated'
import { Section } from '@/components/Section/Section'
import { ReferralsBanner } from '@/components/_referrals/ReferralsBanner/ReferralsBanner'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { publicCryptoVideoFilter } from '@/config/contentFilter'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useInfiniteVideoGrid } from '@/hooks/useInfiniteVideoGrid'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'
import { DEFAULT_VIDEO_GRID, sizes } from '@/styles'
import { createPlaceholderData } from '@/utils/data'
import { InfiniteLoadingOffsets } from '@/utils/loading.contants'

export const HomeView: FC = () => {
  const headTags = useHeadTags()
  const { columns, fetchMore, tiles, loading, pageInfo } = useHomeVideos()

  return (
    <VideoContentTemplate>
      <ReferralsBanner />
      {headTags}
      <StyledSection
        contentProps={{
          type: 'grid',
          grid: DEFAULT_VIDEO_GRID,
          children: tiles?.map((video, idx) => <VideoTileViewer id={video.id} key={idx} />),
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
    </VideoContentTemplate>
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
      where: {
        ...publicCryptoVideoFilter,
        orionLanguage_in: undefined,
        includeInHomeFeed_eq: true,
        isShort_not_eq: undefined,
      },
      skipVideoIds: ['-1'],
    },
  })

  const { columns, fetchMore, pageInfo, tiles } = useInfiniteVideoGrid({
    query: GetBasicVideosConnectionLightweightDocument,
    variables: {
      where: publicCryptoVideoFilter,
      orderBy: VideoOrderByInput.VideoRelevanceDesc,
      first: 1,
    },
  })

  const firstLoad = !data?.dumbPublicFeedVideos && loading
  const firstLoadPlaceholders = firstLoad ? createPlaceholderData(columns * initialRowsToLoad) : []

  const displayedItems = [...(data?.dumbPublicFeedVideos || []), ...(tiles || [])]
  const nextLoadPlaceholders = createPlaceholderData(columns * 4)

  return {
    tiles: [...firstLoadPlaceholders, ...displayedItems, ...(loading ? nextLoadPlaceholders : [])],
    fetchMore,
    columns,
    loading,
    pageInfo,
  }
}
