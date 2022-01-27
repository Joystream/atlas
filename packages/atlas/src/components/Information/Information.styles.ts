import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgActionInformative } from '@/components/_icons'
import { cVar, square } from '@/styles'

export const StyledSvgActionInformative = styled(SvgActionInformative)`
  path {
    transition: fill ${cVar('animationTransitionFast')};
    fill: ${cVar('colorText')};
  }
`

export const IconWrapper = styled.div`
  ${square(32)};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background ${cVar('animationTransitionFast')};

  @media (hover: hover) {
    cursor: pointer;

    :hover {
      background: ${cVar('colorBackgroundAlpha')};
      ${StyledSvgActionInformative} {
        path {
          fill: ${cVar('colorTextStrong')};
        }
      }
    }
  }
`

export const TouchableWrapper = styled.div<{ isMobile?: boolean }>`
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  display: inline-flex;
  ${({ isMobile }) =>
    isMobile &&
    css`
      padding: 8px;
      margin: -8px;
      :active ${IconWrapper} {
        background: ${cVar('colorBackgroundAlpha')};
        ${StyledSvgActionInformative} {
          path {
            fill: ${cVar('colorTextStrong')};
          }
        }
      }
    `};
`

export const InformationWrapper = styled.div`
  display: inline-flex;

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
