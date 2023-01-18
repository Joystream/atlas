import styled from '@emotion/styled'

import { SvgActionDrag } from '@/assets/icons'
import { cVar, media, sizes } from '@/styles'

export const Wrapper = styled.div<{ isDragging: boolean }>`
  display: flex;
  gap: ${sizes(1)};
  background-color: ${(props) => (props.isDragging ? cVar('colorCoreNeutral800Lighten') : 'unset')};
  opacity: ${(props) => (props.isDragging ? 0.7 : 1)};

  ${media.sm} {
    padding: 0 ${sizes(4)};

    :hover {
      cursor: grab;
      background-color: ${cVar('colorBackgroundAlpha')};
    }
  }
`

export const StyledSvgActionDrag = styled(SvgActionDrag)`
  align-self: center;
`

export const ChevronWrapper = styled.div`
  display: grid;
  gap: ${sizes(8)};
  align-content: start;
  margin-top: ${sizes(4)};
  padding-left: ${sizes(4)};

  > * {
    cursor: pointer;
  }
`
