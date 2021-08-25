import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { LayoutGrid } from '@/shared/components/LayoutGrid'
import { colors, sizes } from '@/shared/theme'

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
  border-bottom: 1px solid ${colors.gray[700]};
`
