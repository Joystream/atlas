import styled from '@emotion/styled'
import React from 'react'

import { useMediaMatch } from '@/hooks/useMediaMatch'
import { GridItem } from '@/shared/components/LayoutGrid'
import { Text } from '@/shared/components/Text'
import { FeaturedVideoCategoryCard, VideoCategoryCard } from '@/shared/components/VideoCategoryCard'
import { colors, media, sizes } from '@/shared/theme'

export const DiscoverView: React.FC = () => {
  const isMdBreakpoint = useMediaMatch('md')
  return (
    <Container>
      <Text variant="h2">Discover</Text>
      <FeaturedCategoriesContainer>
        {[0, 0, 0].map((category, i, arr) => (
          <GridItem key={i} colSpan={{ sm: i === 0 ? 2 : 1, xl: 1 }}>
            <FeaturedVideoCategoryCard variant={isMdBreakpoint ? 'default' : 'compact'} color="#E7BE2D" />
          </GridItem>
        ))}
      </FeaturedCategoriesContainer>
      <BorderTextContainer>
        <Text variant="h4">All categories</Text>
      </BorderTextContainer>
      <CategoriesContainer>
        {[0, 0, 0, 0, 0, 0, 0, 0].map((category, i) => (
          <VideoCategoryCard key={i} variant={isMdBreakpoint ? 'default' : 'compact'} color="#E7BE2D" />
        ))}
      </CategoriesContainer>
    </Container>
  )
}

const Container = styled.div`
  margin: ${sizes(16)} 0;
`

const FeaturedCategoriesContainer = styled.div`
  display: grid;
  gap: ${sizes(4)};
  margin: ${sizes(16)} 0;

  ${media.sm} {
    grid-template-columns: 1fr 1fr;
  }

  ${media.xl} {
    grid-template-columns: repeat(3, 1fr);
  }
`

const CategoriesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${sizes(4)};
  margin: ${sizes(12)} 0 ${sizes(16)} 0;

  ${media.lg} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${media.xl} {
    grid-template-columns: repeat(4, 1fr);
  }
`

const BorderTextContainer = styled.div`
  padding-bottom: ${sizes(5)};
  border-bottom: 1px solid ${colors.gray[700]};
`
