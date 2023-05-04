import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { media, sizes } from '@/styles'

export const StyledLimitedWidth = styled(LimitedWidthContainer)`
  padding: ${sizes(16)} 0;
  display: grid;
  gap: ${sizes(8)};
  ${media.md} {
    gap: ${sizes(16)};
  }
`
