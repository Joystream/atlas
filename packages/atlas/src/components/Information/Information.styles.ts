import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgActionInformative } from '@/components/_icons'
import { cVar, sizes } from '@/styles'

export const StyledSvgActionInformative = styled(SvgActionInformative)`
  path {
    transition: fill ${cVar('animationTransitionFast')};
    fill: ${cVar('colorText')};
  }
`

export const IconWrapper = styled.div`
  border-radius: 50%;
  padding: ${sizes(2)};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background ${cVar('animationTransitionFast')};
  cursor: pointer;
`

export const TouchableWrapper = styled.div<{ isMobile?: boolean }>`
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  display: inline-flex;

  :hover ${IconWrapper} {
    background: ${cVar('colorBackgroundAlpha')};
    ${StyledSvgActionInformative} {
      path {
        fill: ${cVar('colorTextStrong')};
      }
    }
  }

  ${({ isMobile }) =>
    isMobile &&
    css`
      padding: 8px;
      margin: -8px;
    `};
`

export const InformationWrapper = styled.div`
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;

  & > span:focus {
    ${IconWrapper} {
      background: ${cVar('colorBackgroundAlpha')};
    }
    ${StyledSvgActionInformative} {
      path {
        fill: ${cVar('colorTextStrong')};
      }
    }
  }
`
