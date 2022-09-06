import { FC, useMemo } from 'react'

import { useCategories } from '@/api/hooks/categories'
import { useAllCategoriesFeaturedVideos } from '@/api/hooks/categoriesFeaturedVideos'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { FeaturedVideoCategoryCard, VideoCategoryCard } from '@/components/_video/VideoCategoryCard'
import { useCategoriesMatch } from '@/hooks/useCategoriesMatch'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar } from '@/styles'
import { createLookup } from '@/utils/data'

import {
  FeaturedCategoriesContainer,
  StyledGridHeadingContainer,
  StyledLimitedWidthContainer,
} from './DiscoverView.styles'

export const DiscoverView: FC = () => {
  const { categories, totalVideosCount, loading } = useCategories()
  const mappedVideoCategories = useCategoriesMatch()

  const { allCategoriesFeaturedVideos } = useAllCategoriesFeaturedVideos()

  const categoriesFeaturedVideos = allCategoriesFeaturedVideos
    ? createLookup(allCategoriesFeaturedVideos.map((category) => ({ id: category.categoryId, ...category })))
    : null

  const featuredVideoCategoryCardsData = useMemo(() => {
    const _featuredVideoCategoryCardsData =
      categories
        ?.map((category) => {
          const video = categoriesFeaturedVideos?.[category.id]?.categoryFeaturedVideos.find(
            (video) => !!video.videoCutUrl
          )

          if (!video) return null

          return {
            videoTitle: video?.video.title ?? '',
            videoUrl: video?.videoCutUrl ?? '',
            ...mappedVideoCategories?.find((cat) => cat.id === category.id),
          }
        })
        .filter((cat) => !!cat)
        .slice(0, 3) ?? []

    if (_featuredVideoCategoryCardsData.length > 0) {
      return _featuredVideoCategoryCardsData
    }

    if (!categories) {
      return [null, null, null]
    }

    return null
  }, [categories, mappedVideoCategories, categoriesFeaturedVideos])

  const isMdBreakpoint = useMediaMatch('md')

  const headTags = useHeadTags('Discover')

  return (
    <StyledLimitedWidthContainer big>
      {headTags}
      <Text as="p" variant="h700">
        Discover
      </Text>
      {featuredVideoCategoryCardsData && (
        <FeaturedCategoriesContainer>
          {featuredVideoCategoryCardsData.map((category, i) => (
            <GridItem key={category?.id ?? `placeholder-${i}`} colSpan={{ base: 12, sm: i === 0 ? 12 : 6, xl: 4 }}>
              <FeaturedVideoCategoryCard
                variant={isMdBreakpoint ? 'default' : 'compact'}
                title={category?.name ?? ''}
                videoTitle={category?.videoTitle ?? ''}
                videoUrl={category?.videoUrl ?? ''}
                color={category?.color ?? cVar('colorCoreBaseWhite')}
                icon={category?.icon}
                id={category?.id}
              />
            </GridItem>
          ))}
        </FeaturedCategoriesContainer>
      )}
      <StyledGridHeadingContainer>
        <Text as="h2" variant="h500">
          All categories
        </Text>
      </StyledGridHeadingContainer>
      <LayoutGrid>
        {(mappedVideoCategories ?? new Array(15).fill(null))?.map((category, i) => (
          <GridItem key={i} colSpan={{ base: 6, lg: 4, xl: 3 }}>
            <VideoCategoryCard
              isLoading={category === null || loading}
              title={category?.name ?? ''}
              categoryVideosCount={category?.activeVideosCounter}
              coverImg={category?.coverImg ?? ''}
              color={category?.color ?? cVar('colorCoreBaseWhite')}
              icon={category?.icon}
              videosTotalCount={totalVideosCount}
              variant={isMdBreakpoint ? 'default' : 'compact'}
              id={category?.id}
            />
          </GridItem>
        ))}
      </LayoutGrid>
    </StyledLimitedWidthContainer>
  )
}
