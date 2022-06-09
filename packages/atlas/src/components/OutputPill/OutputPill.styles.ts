import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

import { Avatar } from '../Avatar'
import { Button } from '../_buttons/Button'
import { SvgActionClose } from '../_icons'

export const OutputPillWrapper = styled.div<{ withoutButton?: boolean }>`
  background-color: ${cVar('colorBackgroundStrong')};
  display: inline-flex;
  align-items: center;
  padding: ${({ withoutButton }) => (withoutButton ? `${sizes(1.5)} ${sizes(2)}` : `0 0 0 ${sizes(2)}`)};
  border-radius: ${cVar('radiusSmall')};
`

export const StyledAvatar = styled(Avatar)`
  margin-right: ${sizes(2)};
  margin-left: -${sizes(1)};
`

export const StyledSVGCloseIcon = styled(SvgActionClose)`
  path {
    fill: ${cVar('colorText')};
    transition: fill ${cVar('animationTransitionFast')};
  }
`
export const RemoveButton = styled(Button)`
  border-radius: 0;
  margin-left: ${sizes(1)};

  :hover {
    ${StyledSVGCloseIcon} {
      path {
        fill: ${cVar('colorTextStrong')};
      }
    }
  }
`
