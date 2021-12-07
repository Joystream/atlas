import styled from '@emotion/styled'

import { LayoutGrid } from '@/components/LayoutGrid'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { sizes } from '@/styles'

export const StyledLimitedWidthContainer = styled(LimitedWidthContainer)`
  margin: 0 auto;
  padding-top: ${sizes(16)};
`

export const FeaturedCategoriesContainer = styled(LayoutGrid)`
  margin: ${sizes(16)} 0;
`

export const CategoriesContainer = styled(LayoutGrid)`
  margin-top: ${sizes(12)};
`
