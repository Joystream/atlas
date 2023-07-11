import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const Table = styled.table`
  border-bottom: 1px solid ${cVar('colorBorderMutedAlpha')};
  width: 100%;

  thead th {
    text-align: center;
    color: ${cVar('colorText')};
    padding: ${sizes(4)} ${sizes(2)};
    width: 33%;
  }

  tbody {
    th {
      border-top: 1px solid ${cVar('colorBorderMutedAlpha')};
      color: ${cVar('colorTextMuted')};
      padding: ${sizes(8)} ${sizes(2)} ${sizes(2)};
      text-align: start;
      text-transform: uppercase;
    }

    td {
      color: ${cVar('colorTextStrong')};
      padding: ${sizes(2)};
      text-align: center;

      &:first-child {
        text-align: start;
      }
    }
  }
`
