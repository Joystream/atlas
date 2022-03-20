import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

import { Text } from '../Text'
import { SvgActionClose } from '../_icons'

export const MemberBadgeWrapper = styled.div<{ withoutButton?: boolean }>`
  background-color: ${cVar('colorBackgroundStrong')};
  display: inline-flex;
  align-items: center;
  padding-left: ${sizes(2)};
  padding: ${({ withoutButton }) => (withoutButton ? `${sizes(1)} ${sizes(2)}` : `0 0 0 ${sizes(2)}`)};
`

export const StyledHandleText = styled(Text)`
  margin-left: ${sizes(2)};
`

export const StyledSVGCloseIcon = styled(SvgActionClose)`
  path {
    fill: ${cVar('colorText')};
    transition: fill ${cVar('animationTransitionFast')};
  }
`
export const RemoveButton = styled.button`
  background: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  width: 32px;
  height: 32px;

  :hover {
    ${StyledSVGCloseIcon} {
      path {
        fill: ${cVar('colorTextStrong')};
      }
    }
  }
`
