import styled from '@emotion/styled'
import { FC, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { GetBasicVideosConnectionLightweightDocument } from '@/api/queries/__generated__/videos.generated'
import { Section } from '@/components/Section/Section'
import { ReferralsBanner } from '@/components/_referrals/ReferralsBanner/ReferralsBanner'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { publicCryptoVideoFilter } from '@/config/contentFilter'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useInfiniteVideoGrid } from '@/hooks/useInfiniteVideoGrid'
import { getCorrectLoginModal } from '@/providers/auth/auth.helpers'
import { useAuthStore } from '@/providers/auth/auth.store'
import { DEFAULT_VIDEO_GRID, sizes } from '@/styles'
import { InfiniteLoadingOffsets } from '@/utils/loading.contants'

export const HomeView: FC = () => {
  const location = useLocation()
  const {
    actions: { setAuthModalOpenName },
  } = useAuthStore()

  const headTags = useHeadTags()
  const { columns, fetchMore, pageInfo, tiles } = useInfiniteVideoGrid({
    query: GetBasicVideosConnectionLightweightDocument,
    variables: {
      where: publicCryptoVideoFilter,
      orderBy: VideoOrderByInput.VideoRelevanceDesc,
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
          children: tiles?.map((video, idx) => <VideoTileViewer id={video.id} key={idx} />),
        }}
        footerProps={{
          reachedEnd: !pageInfo?.hasNextPage,
          fetchMore: async () => {
            if (pageInfo?.hasNextPage) {
              await fetchMore({
                variables: { first: columns * 4, after: pageInfo.endCursor },
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
