import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { media, sizes } from '@/styles'

export const NoGlobalPaddingWrapper = styled.div`
  margin: 0 calc(-1 * var(--size-global-horizontal-padding));
`

export const StyledLimitedWidthContainer = styled(LimitedWidthContainer)`
  margin: ${sizes(4)} auto;
  ${media.md} {
    margin: ${sizes(8)} auto;
  }
`
