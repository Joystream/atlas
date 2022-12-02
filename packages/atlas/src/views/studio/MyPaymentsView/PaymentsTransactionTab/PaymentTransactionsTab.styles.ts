import styled from '@emotion/styled'

import { media, sizes } from '@/styles'

export const TilesWrapper = styled.div`
  display: grid;
  gap: ${sizes(6)};
  margin-bottom: ${sizes(6)};

  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
`
