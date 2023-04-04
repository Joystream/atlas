import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { cVar, media, square } from '@/styles'

import { ARROWS_MARGINS, PAGINATION_BUTTON_WIDTH } from './constants'

type PaginationButtonProps = {
  isActive?: boolean
  isHidden?: boolean
}

export const PaginationWrapper = styled.div`
  display: flex;
  max-width: 400px;
  justify-content: center;

  ${media.xs} {
    max-width: unset;
  }
`

export const ChevronButton = styled(Button)`
  user-select: none;

  &:first-of-type {
    margin-right: ${ARROWS_MARGINS}px;
  }

  &:last-of-type {
    margin-left: ${ARROWS_MARGINS}px;
  }
`

export const ThreeDotsWrapper = styled.div`
  ${square(PAGINATION_BUTTON_WIDTH)};

  color: ${cVar('colorCoreNeutral300')};
  font: ${cVar('typographyDesktopH200')};
  letter-spacing: ${cVar('typographyDesktopH200LetterSpacing')};
  text-transform: ${cVar('typographyDesktopH200TextTransform')};
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: default;
  user-select: none;
`

const buttonActiveState = css`
  background-color: ${cVar('colorCoreNeutral800Lighten')};
  color: ${cVar('colorCoreNeutral50')};
`

export const PaginationButton = styled(Button)<PaginationButtonProps>`
  ${square(PAGINATION_BUTTON_WIDTH)};

  color: ${cVar('colorCoreNeutral300')};
  border-radius: 100%;
  user-select: none;

  :hover,
  :focus-visible,
  :active {
    background-color: ${cVar('colorBackgroundStrongAlpha')};
    color: ${cVar('colorCoreNeutral50')};
  }

  ${({ isActive }) => isActive && buttonActiveState};
`
