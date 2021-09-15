import React from 'react'

import { useVideoCount } from '@/api/hooks'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { GridItem } from '@/shared/components/LayoutGrid'
import { Text } from '@/shared/components/Text'
import { FeaturedVideoCategoryCard, VideoCategoryCard } from '@/shared/components/VideoCategoryCard'
import { SentryLogger } from '@/utils/logs'

import {
  BorderTextContainer,
  CategoriesContainer,
  FeaturedCategoriesContainer,
  StyledLimitedWidthContainer,
} from './DiscoverView.style'
import { featuredVideoCategories, videoCategories } from './data'

export const DiscoverView: React.FC = () => {
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
        {featuredVideoCategories.map((category, i) => (
          <GridItem key={i} colSpan={{ base: 12, sm: i === 0 ? 12 : 6, xl: 4 }}>
            <FeaturedVideoCategoryCard
              variant={isMdBreakpoint ? 'default' : 'compact'}
              title={category.title}
              videoTitle={category.videoTitle}
              videoUrl={category.videoUrl}
              color={category.color}
              icon={category.icon}
            />
          </GridItem>
        ))}
      </FeaturedCategoriesContainer>
      <BorderTextContainer>
        <Text variant="h4">All categories</Text>
      </BorderTextContainer>
      <CategoriesContainer>
        {Object.values(videoCategories).map((category, i) => (
          <GridItem key={i} colSpan={{ base: 6, lg: 4, xl: 3 }}>
            <VideoCategoryCard
              title={category.title}
              coverImg={category.coverImg}
              categoryId={category.id}
              color={category.color}
              icon={category.icon}
              videosTotalCount={videoCount}
              variant={isMdBreakpoint ? 'default' : 'compact'}
            />
          </GridItem>
        ))}
      </CategoriesContainer>
    </StyledLimitedWidthContainer>
  )
}
