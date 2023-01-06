import styled from '@emotion/styled'

import { SvgActionDrag } from '@/assets/icons'
import { cVar, sizes } from '@/styles'

export const Wrapper = styled.div<{ isDragging: boolean }>`
  display: flex;
  gap: ${sizes(1)};
  opacity: ${(props) => (props.isDragging ? 0 : 1)};
  cursor: grab;
  padding: 0 ${sizes(4)};

  :hover {
    background-color: ${cVar('colorBackgroundAlpha')};
  }
`

export const StyledSvgActionDrag = styled(SvgActionDrag)`
  align-self: center;
`
