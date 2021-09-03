import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { colors, media, sizes } from '@/shared/theme'

export const StyledLimitedWidthContainer = styled(LimitedWidthContainer)`
  margin: ${sizes(16)} auto;
`

export const FeaturedCategoriesContainer = styled.div`
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

export const CategoriesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${sizes(6)};
  margin: ${sizes(12)} 0 ${sizes(16)} 0;

  ${media.lg} {
    grid-template-columns: repeat(3, 1fr);
  }

  ${media.xl} {
    grid-template-columns: repeat(4, 1fr);
  }
`

export const BorderTextContainer = styled.div`
  padding-bottom: ${sizes(5)};
  border-bottom: 1px solid ${colors.gray[700]};
`
