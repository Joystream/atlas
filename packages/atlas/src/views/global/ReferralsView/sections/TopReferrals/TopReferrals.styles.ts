import styled from '@emotion/styled'

import { media, sizes } from '@/styles'

export const StyledTopReferrersGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr;
  gap: ${sizes(4)};

  ${media.sm} {
    grid-template-columns: minmax(0, 2fr) 1fr 1fr;
  }

  ${media.lg} {
    gap: ${sizes(6)};
  }
`
