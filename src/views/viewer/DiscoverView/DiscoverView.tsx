import { sampleSize } from 'lodash-es'
import React from 'react'

import { useCategoriesFeaturedVideos } from '@/api/featured/categoriesFeaturedVideos'
import { useCategories, useVideoCount } from '@/api/hooks'
import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { FeaturedVideoCategoryCard, VideoCategoryCard } from '@/components/_video/VideoCategoryCard'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { SentryLogger } from '@/utils/logs'

import {
  BorderTextContainer,
  CategoriesContainer,
  FeaturedCategoriesContainer,
  StyledLimitedWidthContainer,
} from './DiscoverView.style'
import { videoCategories } from './data'

export const DiscoverView: React.FC = () => {
  const { categories } = useCategories()
  const mappedVideoCategories = categories?.map((category) => ({
    ...videoCategories[category.id],
    ...category,
  }))

  const categoriesFeaturedVideos = useCategoriesFeaturedVideos()
  const featuredVideoCategoryCardsData = React.useMemo(() => {
    const _featuredVideoCategoryCardsData = sampleSize(
      categories
        ?.map((category) => {
          const video = categoriesFeaturedVideos?.[category.id]?.find((video) => !!video.videoCutUrl)
          return video === undefined
            ? undefined
            : {
                videoTitle: video?.title ?? '',
                videoUrl: video?.videoCutUrl ?? '',
                ...mappedVideoCategories?.find((cat) => cat.id === category.id),
              }
        })
        .filter((cat) => !!cat),
      3
    )

    return _featuredVideoCategoryCardsData.length > 0 ? _featuredVideoCategoryCardsData : [null, null, null]
  }, [categories, categoriesFeaturedVideos, mappedVideoCategories])
  const { videoCount, error } = useVideoCount(
    {},
    {
      onError: (error) => SentryLogger.error('Failed to fetch videos count', 'DiscoverView', error),
    }
  )
  const isMdBreakpoint = useMediaMatch('md')

  if (error) {
    return <ViewErrorFallback />
  }

  return (
    <StyledLimitedWidthContainer big>
      <Text variant="h2">Discover</Text>
      <FeaturedCategoriesContainer>
        {featuredVideoCategoryCardsData?.map((category, i) => (
          <GridItem key={category?.id ?? i} colSpan={{ base: 12, sm: i === 0 ? 12 : 6, xl: 4 }}>
            <FeaturedVideoCategoryCard
              variant={isMdBreakpoint ? 'default' : 'compact'}
              title={category?.name ?? ''}
              videoTitle={category?.videoTitle ?? ''}
              videoUrl={category?.videoUrl ?? ''}
              color={category?.color ?? 'white'}
              icon={category?.icon}
              id={category?.id}
            />
          </GridItem>
        ))}
      </FeaturedCategoriesContainer>
      <BorderTextContainer>
        <Text variant="h4">All categories</Text>
      </BorderTextContainer>
      <CategoriesContainer>
        {(mappedVideoCategories ?? new Array(15).fill(null))?.map((category, i) => (
          <GridItem key={i} colSpan={{ base: 6, lg: 4, xl: 3 }}>
            <VideoCategoryCard
              isLoading={category === null}
              title={category?.name ?? ''}
              coverImg={category?.coverImg ?? ''}
              categoryId={category?.id}
              color={category?.color ?? 'white'}
              icon={category?.icon}
              videosTotalCount={videoCount}
              variant={isMdBreakpoint ? 'default' : 'compact'}
              id={category?.id}
            />
          </GridItem>
        ))}
      </CategoriesContainer>
    </StyledLimitedWidthContainer>
  )
}
