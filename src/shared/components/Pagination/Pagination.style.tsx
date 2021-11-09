import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { media, square, transitions, typography } from '@/shared/theme'
import { cVar } from '@/styles'

import { ARROWS_MARGINS, PAGINATION_BUTTON_WIDTH } from './constants'

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

export const PaginationButton = styled.button<PaginationButtonProps>`
  ${square(PAGINATION_BUTTON_WIDTH)};

  display: flex;
  flex-shrink: 0;
  border: none;
  cursor: pointer;
  color: ${cVar('colorCoreNeutral300')};
  font-size: ${typography.sizes.subtitle2};
  justify-content: center;
  align-items: center;
  background: none;
  border-radius: 100%;
  text-decoration: none;
  font-family: ${typography.fonts.headers};
  transition: background-color ${transitions.timings.loading} ${transitions.easing},
    color ${transitions.timings.loading} ${transitions.easing}, opacity 200ms ${transitions.easing};
  user-select: none;

  :hover,
  :focus {
    background-color: ${cVar('colorCoreNeutral700Lighten')};
    color: ${cVar('colorCoreNeutral50')};
  }

  :active {
    ${buttonActiveState};
  }

  ${({ isActive }) => isActive && buttonActiveState};
`
