import { FC } from 'react'

import { CategoryIcon } from '@/components/CategoryIcon'
import { Section } from '@/components/Section/Section'
import { Grid } from '@/components/Section/SectionContent/SectionContent.styles'
import { VideoCategoryCard } from '@/components/_video/VideoCategoryCard'
import { atlasConfig } from '@/config'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useVideoDisplayCategoriesWithCounter } from '@/hooks/useVideoDisplayCategoriesWithCounter'
import { cVar } from '@/styles'

import { StyledLimitedWidthContainer } from './DiscoverView.styles'

const GRID: Grid = {
  xxs: {
    columns: 2,
  },
  lg: {
    columns: 3,
  },
  xl: {
    columns: 4,
  },
}

export const DiscoverView: FC = () => {
  const { loading, displayCategoriesWithCounter, totalVideosCount } = useVideoDisplayCategoriesWithCounter()

  const categoriesNumber = atlasConfig.content.categories.length

  const isMdBreakpoint = useMediaMatch('md')

  const headTags = useHeadTags('Discover')

  return (
    <StyledLimitedWidthContainer big>
      {headTags}
      <Section
        contentProps={{
          type: 'grid',
          grid: GRID,
          children: (displayCategoriesWithCounter ?? new Array(categoriesNumber).fill(null))?.map((category, i) => (
            <VideoCategoryCard
              key={i}
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
          )),
        }}
      />
    </StyledLimitedWidthContainer>
  )
}
