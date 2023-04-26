import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { media, sizes } from '@/styles'

export const StyledLimitedWidthContainer = styled(LimitedWidthContainer)`
  margin: 0 auto;
  padding: ${sizes(4)} 0;

  ${media.md} {
    padding: ${sizes(8)} 0;
  }

  ${media.xxl} {
    padding: ${sizes(8)} ${sizes(9)};
  }
`
