import styled from '@emotion/styled'
import { shuffle } from 'lodash-es'
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
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useVideoGridRows } from '@/hooks/useVideoGridRows'
import { DEFAULT_VIDEO_GRID, sizes } from '@/styles'
import { createPlaceholderData } from '@/utils/data'
import { InfiniteLoadingOffsets } from '@/utils/loading.contants'

const _options = [
  {
    label: 'Crypto',
    configLabel: 'Crypto',
    value: '5',
    queryValue: atlasConfig.content.categories.find((category) => category.name === 'Crypto')?.videoCategories ?? [],
  },
  {
    label: 'Entertainment',
    configLabel: 'Entertainment',
    value: '8',
    queryValue:
      atlasConfig.content.categories.find((category) => category.name === 'Entertainment')?.videoCategories ?? [],
  },
  {
    label: 'Gaming',
    configLabel: 'Video Games',
    value: '20',
    queryValue:
      atlasConfig.content.categories.find((category) => category.name === 'Video Games')?.videoCategories ?? [],
  },
  {
    label: 'Music',
    configLabel: 'Music and Music Videos',
    value: '11',
    queryValue:
      atlasConfig.content.categories.find((category) => category.name === 'Music and Music Videos')?.videoCategories ??
      [],
  },
  {
    label: 'Blogs',
    configLabel: 'People and Blogs',
    value: '14',
    queryValue:
      atlasConfig.content.categories.find((category) => category.name === 'People and Blogs')?.videoCategories ?? [],
  },
  {
    label: 'Animation',
    configLabel: 'Animation and Film',
    value: '2',
    queryValue:
      atlasConfig.content.categories.find((category) => category.name === 'Animation and Film')?.videoCategories ?? [],
  },
  {
    label: 'Technology',
    configLabel: 'Technology',
    value: '17',
    queryValue:
      atlasConfig.content.categories.find((category) => category.name === 'Technology')?.videoCategories ?? [],
  },
  {
    label: 'Art',
    configLabel: 'Art',
    value: '1',
    queryValue: atlasConfig.content.categories.find((category) => category.name === 'Art')?.videoCategories ?? [],
  },
  {
    label: 'Memes',
    configLabel: 'Memes and Humour',
    value: '10',
    queryValue:
      atlasConfig.content.categories.find((category) => category.name === 'Memes and Humour')?.videoCategories ?? [],
  },
]

const options = [
  ...shuffle(_options),
  {
    label: 'Other',
    value: 'other',
    queryValue:
      atlasConfig.content.categories
        .filter(
          (category) =>
            !_options.reduce((prev, next) => [...prev, next.configLabel], [] as string[]).includes(category.name)
        )
        .map((cat) => cat.videoCategories)
        .flat() ?? [],
  },
]

export const HomeView: FC = () => {
  const headTags = useHeadTags()
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? options[0].value
  const { columns, fetchMore, tiles, loading, pageInfo } = useHomeVideos(
    options.find((opt) => opt.value === category)?.queryValue
  )
  const { trackHomepageCategorySelection } = useSegmentAnalytics()

  const setCategory = useCallback(
    (value: string) => {
      const categoryLabel = options.find((category) => category.value === value)?.label
      if (categoryLabel) {
        trackHomepageCategorySelection(categoryLabel)
      }

      setSearchParams({ category: value })
    },
    [setSearchParams, trackHomepageCategorySelection]
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
      where: getPublicCryptoVideoFilter(
        {
          id_not_in: avoidIds,
          category: {
            id_in: categories,
          },
        },
        true
      ),
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
