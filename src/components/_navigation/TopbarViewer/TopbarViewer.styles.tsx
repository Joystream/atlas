import styled from '@emotion/styled'

import { IconButton } from '@/components/_inputs/IconButton'
import { cVar } from '@/styles'
import { colors, media, sizes, square, transitions, zIndex } from '@/theme'

import { TopbarBase } from '../TopbarBase'

type FocusProps = {
  hasFocus: boolean
}

export const StyledTopbarBase = styled(TopbarBase)<FocusProps>`
  transition: background-color 0.4s ${transitions.easing};
  background-color: ${({ hasFocus }) => (hasFocus ? colors.gray[900] : colors.black)};
  ${({ hasFocus }) => hasFocus && `z-index: ${zIndex.globalOverlay}`};

  ${media.md} {
    /**
    *  We need to change left and padding properties when search is open, because of problem with z-indexes between
    *  hamburger and TopBar. When search is open, TopBar must have higher z-index which cause hiding the hamburger
    *  behind TopBar. By moving the TopBar to the right, the hamburger remains visible.
    */

    left: ${({ hasFocus }) => (hasFocus ? 'var(--size-sidenav-width-collapsed)' : 0)};
    padding: ${({ hasFocus }) => `${sizes(4)} calc(${sizes(8)} + var(--size-scrollbar-width)) ${sizes(4)}
    ${hasFocus ? sizes(8) : `calc(var(--size-sidenav-width-collapsed) + ${sizes(8)})`}`};
  }

  &.topbar-exit {
    z-index: ${zIndex.globalOverlay};
  }
`

export const SearchbarContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  z-index: ${zIndex.globalOverlay};

  > svg {
    display: none;
  }

  ${media.md} {
    max-width: 480px;
    justify-content: center;
    margin: 0;

    > svg {
      display: none;
    }
  }
`

export const ButtonWrapper = styled.div`
  align-self: center;
  justify-self: flex-end;
  flex-shrink: 0;
`

export const Overlay = styled.div`
  ${square('100%')};

  position: fixed;
  top: 0;
  left: 0;
  background-color: ${colors.transparentBlack[54]};
  display: none;
  transition: opacity ${cVar('animationTransitionMedium')};

  ${media.sm} {
    display: block;

    &.searchbar-overlay-enter-active,
    &.searchbar-overlay-exit {
      opacity: 1;
    }

    &.searchbar-overlay-enter,
    &.searchbar-overlay-exit-active {
      opacity: 0;
    }
  }
`

export const StyledIconButton = styled(IconButton)`
  margin-left: ${sizes(2)};
`
