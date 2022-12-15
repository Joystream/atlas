import styled from '@emotion/styled'

import { media, sizes } from '@/styles'

export const TilesWrapper = styled.div`
  display: grid;
  gap: ${sizes(4)};
  margin-bottom: ${sizes(4)};

  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }

  ${media.md} {
    gap: ${sizes(6)};
    margin-bottom: ${sizes(6)};
  }
`

export const TableWrapper = styled.div`
  overflow-x: auto;

  > * {
    min-width: 750px;
  }
`
