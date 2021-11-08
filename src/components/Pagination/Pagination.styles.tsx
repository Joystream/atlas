import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar } from '@/styles'
import { media, square, typography } from '@/theme'

import { ARROWS_MARGINS, PAGINATION_BUTTON_WIDTH } from './constants'

import { Button } from '../Button'
import { IconButton } from '../IconButton'

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

export const ChevronButton = styled(IconButton)`
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
  font-size: ${typography.sizes.subtitle2};
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
  :focus,
  :active {
    color: ${cVar('colorCoreNeutral50')};
  }

  ${({ isActive }) => isActive && buttonActiveState};
`
