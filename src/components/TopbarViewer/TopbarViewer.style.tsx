import styled from '@emotion/styled'

import { IconButton } from '@/shared/components/IconButton'
import { colors, media, sizes, square, transitions, zIndex } from '@/shared/theme'
import { animation } from '@/shared/theme/tokens'

import { TopbarBase } from '../TopbarBase'

type FocusProps = {
  hasFocus: boolean
}

export const StyledTopbarBase = styled(TopbarBase)<FocusProps>`
  transition: background-color 0.4s ${transitions.easing};
  background-color: ${({ hasFocus }) => (hasFocus ? colors.gray[900] : colors.black)};
  ${({ hasFocus }) => hasFocus && `z-index: ${zIndex.globalOverlay}`};

  ${media.md} {
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
  transition: opacity ${animation.medium.timing} ${animation.medium.easing};

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
