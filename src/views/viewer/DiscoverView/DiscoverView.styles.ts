import styled from '@emotion/styled'

import { GridHeadingContainer } from '@/components/GridHeading'
import { LayoutGrid } from '@/components/LayoutGrid'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { sizes } from '@/styles'

export const StyledLimitedWidthContainer = styled(LimitedWidthContainer)`
  margin: 0 auto;
  padding-top: ${sizes(16)};
`

export const FeaturedCategoriesContainer = styled(LayoutGrid)`
  margin-top: ${sizes(16)};
`

export const StyledGridHeadingContainer = styled(GridHeadingContainer)`
  margin-top: ${sizes(16)};
`
