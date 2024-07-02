import styled from '@emotion/styled'
import { FC, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import { VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import {
  GetBasicVideosConnectionLightweightDocument,
  useGetCuratedHompageVideosQuery,
} from '@/api/queries/__generated__/videos.generated'
import { Section } from '@/components/Section/Section'
import { ToggleButtonGroup } from '@/components/_inputs/ToggleButtonGroup'
import { ReferralsBanner } from '@/components/_referrals/ReferralsBanner/ReferralsBanner'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { atlasConfig } from '@/config'
import { getPublicCryptoVideoFilter } from '@/config/contentFilter'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useInfiniteVideoGrid } from '@/hooks/useInfiniteVideoGrid'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'
import { DEFAULT_VIDEO_GRID, sizes } from '@/styles'
import { createPlaceholderData } from '@/utils/data'
import { InfiniteLoadingOffsets } from '@/utils/loading.contants'

const options = [
  {
    label: 'All',
    value: 'all',
    queryValue: undefined,
  },
  {
    label: 'Crypto',
    value: '5',
    queryValue: atlasConfig.content.categories.find((category) => category.name === 'Crypto')?.videoCategories ?? [],
  },
  {
    label: 'Gaming',
    value: '20',
    queryValue:
      atlasConfig.content.categories.find((category) => category.name === 'Video Games')?.videoCategories ?? [],
  },
  {
    label: 'Music',
    value: '11',
    queryValue:
      atlasConfig.content.categories.find((category) => category.name === 'Music and Music Videos')?.videoCategories ??
      [],
  },
  {
    label: 'Entertainment',
    value: '8',
    queryValue:
      atlasConfig.content.categories.find((category) => category.name === 'Entertainment')?.videoCategories ?? [],
  },
  {
    label: 'Other',
    value: 'other',
    queryValue:
      atlasConfig.content.categories
        .filter(
          (category) => !['Crypto', 'Entertainment', 'Music and Music Videos', 'Video Games'].includes(category.name)
        )
        .map((cat) => cat.videoCategories)
        .flat() ?? [],
  },
]

export const HomeView: FC = () => {
  const headTags = useHeadTags()
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? 'all'
  const { columns, fetchMore, tiles, loading, pageInfo } = useHomeVideos(
    options.find((opt) => opt.value === category)?.queryValue
  )

  const setCategory = useCallback(
    (value: string) => {
      setSearchParams({ category: value })
    },
    [setSearchParams]
  )

  return (
    <VideoContentTemplate>
      <ReferralsBanner />
      {headTags}
      <StyledToggleButtonGroup
        size="medium"
        value={category}
        type="options"
        onChange={(newCategory) => setCategory(newCategory as string)}
        options={options}
      />
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

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  margin-top: ${sizes(8)};
`

const useHomeVideos = (categories?: string[]) => {
  const initialRowsToLoad = useVideoGridRows('main')
  const { data, loading } = useGetCuratedHompageVideosQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      where: getPublicCryptoVideoFilter({
        orionLanguage_in: undefined,
        includeInHomeFeed_eq: true,
        category: {
          id_in: categories,
        },
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
        category: {
          id_in: categories,
        },
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
