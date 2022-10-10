import { FC, useMemo } from 'react'

import { useAllCategoriesFeaturedVideos } from '@/api/hooks/categoriesFeaturedVideos'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { CategoryIcon } from '@/components/_icons/CategoryIcon'
import { FeaturedVideoCategoryCard, VideoCategoryCard } from '@/components/_video/VideoCategoryCard'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useVideoDisplayCategoriesWithCounter } from '@/hooks/useVideoDisplayCategoriesWithCounter'
import { cVar } from '@/styles'
import { createLookup } from '@/utils/data'

import {
  FeaturedCategoriesContainer,
  StyledGridHeadingContainer,
  StyledLimitedWidthContainer,
} from './DiscoverView.styles'

export const DiscoverView: FC = () => {
  const { loading, displayCategoriesWithCounter, totalVideosCount } = useVideoDisplayCategoriesWithCounter()
  const { allCategoriesFeaturedVideos } = useAllCategoriesFeaturedVideos()

  const categoriesFeaturedVideos = allCategoriesFeaturedVideos
    ? createLookup(allCategoriesFeaturedVideos.map((category) => ({ id: category.categoryId, ...category })))
    : null

  const featuredVideoCategoryCardsData = useMemo(() => {
    const _featuredVideoCategoryCardsData =
      displayCategoriesWithCounter
        .map((displayCategory) => {
          const video = categoriesFeaturedVideos?.[displayCategory.id]?.categoryFeaturedVideos.find(
            (video) => !!video.videoCutUrl
          )

          if (!video) return null

          return {
            videoTitle: video?.video.title ?? '',
            videoUrl: video?.videoCutUrl ?? '',
            ...displayCategory,
          }
        })
        .filter((cat) => !!cat)
        .slice(0, 3) ?? []

    if (_featuredVideoCategoryCardsData.length > 0) {
      return _featuredVideoCategoryCardsData
    }

    return null
  }, [displayCategoriesWithCounter, categoriesFeaturedVideos])

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
                icon={<CategoryIcon url={category?.iconUrl} color={cVar('colorCoreBaseBlack')} />}
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
        {(displayCategoriesWithCounter ?? new Array(15).fill(null))?.map((category, i) => (
          <GridItem key={i} colSpan={{ base: 6, lg: 4, xl: 3 }}>
            <VideoCategoryCard
              isLoading={category === null || loading}
              title={category?.name ?? ''}
              categoryVideosCount={category?.activeVideosCounter}
              coverImg={category?.coverImgUrl ?? ''}
              color={category?.color ?? cVar('colorCoreBaseWhite')}
              icon={<CategoryIcon url={category?.iconUrl} color={category?.color} />}
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
