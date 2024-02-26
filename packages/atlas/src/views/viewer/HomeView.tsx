import styled from '@emotion/styled'
import { FC, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useGetCuratedHompageVideosQuery } from '@/api/queries/__generated__/videos.generated'
import { Section } from '@/components/Section/Section'
import { ReferralsBanner } from '@/components/_referrals/ReferralsBanner/ReferralsBanner'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { publicCryptoVideoFilter } from '@/config/contentFilter'
import { useBreakpointKey } from '@/hooks/useBreakpointKey'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'
import { getCorrectLoginModal } from '@/providers/auth/auth.helpers'
import { useAuthStore } from '@/providers/auth/auth.store'
import { DEFAULT_VIDEO_GRID, sizes } from '@/styles'
import { createPlaceholderData } from '@/utils/data'
import { InfiniteLoadingOffsets } from '@/utils/loading.contants'

export const HomeView: FC = () => {
  const [hasMoreVideos, setHasMoreVideos] = useState(true)
  const location = useLocation()
  const {
    actions: { setAuthModalOpenName },
  } = useAuthStore()

  const headTags = useHeadTags()
  const { columns, fetchMore, tiles, loading, skipVideoIds } = useHomeVideos()

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
          children: tiles?.map((video, idx) => <VideoTileViewer id={video.id} key={idx} prefetch={idx < 10} />),
        }}
        footerProps={{
          reachedEnd: !hasMoreVideos,
          fetchMore: async () => {
            if (hasMoreVideos && !loading) {
              await fetchMore({
                variables: { limit: columns * 4, skipVideoIds },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult.dumbPublicFeedVideos.length) {
                    setHasMoreVideos(false)
                  }
                  fetchMoreResult.dumbPublicFeedVideos = [
                    ...(prev.dumbPublicFeedVideos ?? []),
                    ...fetchMoreResult.dumbPublicFeedVideos,
                  ]

                  return fetchMoreResult
                },
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
  const [skipVideoIds, setSkipVideoIds] = useState<string[]>(['-1'])
  const breakPointKey = useBreakpointKey()
  const columns = (breakPointKey && DEFAULT_VIDEO_GRID[breakPointKey]?.columns) ?? 0
  const { data, loading, fetchMore } = useGetCuratedHompageVideosQuery({
    notifyOnNetworkStatusChange: true,
    skip: !columns,
    variables: {
      where: { ...publicCryptoVideoFilter, includeInHomeFeed_eq: true, isShort_not_eq: undefined },
      skipVideoIds: ['-1'],
      limit: columns * initialRowsToLoad,
    },
    onCompleted: (result) => {
      if (result.dumbPublicFeedVideos.length) setSkipVideoIds(result.dumbPublicFeedVideos.map((video) => video.id))
    },
  })

  const firstLoad = !data?.dumbPublicFeedVideos && loading
  const firstLoadPlaceholders = firstLoad ? createPlaceholderData(columns * initialRowsToLoad) : []

  const displayedItems = data?.dumbPublicFeedVideos || []
  const nextLoadPlaceholders = createPlaceholderData(columns * 4)

  return {
    tiles: [...firstLoadPlaceholders, ...displayedItems, ...(loading ? nextLoadPlaceholders : [])],
    fetchMore,
    columns,
    loading,
    skipVideoIds,
  }
}
