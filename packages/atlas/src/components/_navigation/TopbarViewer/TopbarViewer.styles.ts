import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { Button } from '@/components/_buttons/Button'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { cVar, media, oldColors, sizes, square, transitions, zIndex } from '@/styles'

import { TopbarBase } from '../TopbarBase'

type FocusProps = {
  hasFocus: boolean
}

const topbarFocusStyles = ({ hasFocus }: FocusProps) =>
  hasFocus
    ? css`
        left: var(--size-sidenav-width-collapsed);
        z-index: ${zIndex.globalOverlay};
        background-color: ${oldColors.gray[900]};

        ${media.md} {
          /*
          *  We need to change left and padding properties when search is open, because of problem with z-indexes between
          *  hamburger and TopBar. When search is open, TopBar must have higher z-index which cause hiding the hamburger
          *  behind TopBar. By moving the TopBar to the right, the hamburger remains visible.
          */
          left: var(--size-sidenav-width-collapsed);
          padding-left: ${sizes(8)};
        }
      `
    : css`
        background-color: ${oldColors.black};
      `

export const StyledTopbarBase = styled(TopbarBase)<FocusProps>`
  transition: background-color 0.4s ${transitions.easing};
  ${topbarFocusStyles};

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
    margin: 0 auto;

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

export const SignedButtonsWrapper = styled.div`
  display: flex;
`
export const StyledAvatar = styled(Avatar)`
  margin-left: ${sizes(4)};
`

export const Overlay = styled.div`
  ${square('100%')};

  position: fixed;
  top: 0;
  left: 0;
  background-color: ${oldColors.transparentBlack[54]};
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

export const StyledIconButton = styled(Button)`
  margin-left: ${sizes(2)};
`

export const StyledButtonSkeletonLoader = styled(SkeletonLoader)`
  margin-left: ${sizes(2)};
`
