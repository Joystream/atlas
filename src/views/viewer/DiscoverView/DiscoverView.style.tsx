import styled from '@emotion/styled'

import { LayoutGrid } from '@/components/LayoutGrid'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { oldColors, sizes } from '@/styles'

export const StyledLimitedWidthContainer = styled(LimitedWidthContainer)`
  margin: ${sizes(16)} auto;
`

export const FeaturedCategoriesContainer = styled(LayoutGrid)`
  margin: ${sizes(16)} 0;
`

export const CategoriesContainer = styled(LayoutGrid)`
  margin: ${sizes(12)} 0 ${sizes(16)} 0;
`

export const BorderTextContainer = styled.div`
  padding-bottom: ${sizes(5)};
  border-bottom: 1px solid ${oldColors.gray[700]};
`
