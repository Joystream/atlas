import styled from '@emotion/styled'

import { SvgActionTrash } from '@/assets/icons'
import { cVar, media, sizes, square } from '@/styles'

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${sizes(2)};

  ${media.sm} {
    gap: ${sizes(4)};
    grid-template-columns: 1fr auto;
  }
`

// above
//> *:nth-child(1) {
//  grid-column: 1/2;
//}

//> *:nth-child(2) {
//  grid-column: 2/3;
//  //grid-row: 1;
//  justify-self: end;
//}

export const StyledSvgActionTrash = styled(SvgActionTrash)`
  path {
    fill: ${cVar('colorTextError')};
  }
`

export const EmojiPlaceholder = styled.div`
  ${square(40)};

  border-radius: 50%;
  background: gray;
`
