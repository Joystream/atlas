import styled from '@emotion/styled'

import { SvgActionTrash } from '@/assets/icons'
import { cVar, media, sizes } from '@/styles'

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${sizes(2)};

  > *:nth-child(2) {
    grid-column: 1/3;
  }

  > *:nth-child(3) {
    grid-column: 2/3;
    grid-row: 1;
    justify-self: end;
  }

  ${media.sm} {
    gap: ${sizes(4)};
    grid-template-columns: auto 1fr auto;

    > *:nth-child(2) {
      grid-column: 2/3;
    }

    > *:nth-child(3) {
      grid-column: 3/4;
    }
  }
`

export const StyledSvgActionTrash = styled(SvgActionTrash)`
  path {
    fill: ${cVar('colorTextError')};
  }
`

export const EmojiPlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: gray;
`
