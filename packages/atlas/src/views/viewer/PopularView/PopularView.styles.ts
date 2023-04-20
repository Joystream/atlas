import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { media, sizes } from '@/styles'

export const StyledLimidtedWidth = styled(LimitedWidthContainer)`
  display: grid;
  gap: ${sizes(8)};
  padding: ${sizes(4)} 0;

  ${media.md} {
    gap: ${sizes(16)};
    padding: ${sizes(4)} 0;
  }
`
