import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgJoyTokenMonochrome24 } from '@/assets/icons'
import { cVar, media, sizes } from '@/styles'

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

export const TableWrapper = styled.div<{ isEmpty?: boolean }>`
  overflow-x: auto;

  ${({ isEmpty }) =>
    !isEmpty
      ? css`
          > * {
            min-width: 900px;
          }
        `
      : ''}
`

export const StyledSvgJoyTokenMonochrome24 = styled(SvgJoyTokenMonochrome24)`
  path {
    fill: ${cVar('colorText')};
  }
`
