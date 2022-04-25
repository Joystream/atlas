import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { cVar, media, zIndex } from '@/styles'

const sizeObj = {
  small: 'small',
  medium: 'medium',
  large: 'large',
}

export type ModalSize = keyof typeof sizeObj

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: ${zIndex.globalOverlay};
  background-color: ${cVar('colorBackgroundOverlay')};
  transition: opacity ${cVar('animationTransitionMedium')};
`

type ModalContentProps = {
  noBoxShadow?: boolean
  'data-size': ModalSize
}

export const ModalContent = styled.div<ModalContentProps>`
  display: flex;
  z-index: ${zIndex.globalOverlay};
  position: fixed;
  min-width: 100vw;
  max-height: calc(100vh - var(--size-topbar-height));
  overflow: hidden;
  bottom: 0;
  ${({ noBoxShadow }) =>
    !noBoxShadow &&
    css`
      box-shadow: ${cVar('effectElevation24Layer2')}, ${cVar('effectElevation24Layer1')};
    `};

  ${media.sm} {
    --max-width: calc(100vw - var(--size-topbar-height) * 2);

    min-width: 480px;
    max-height: calc(100vh - var(--size-topbar-height) * 2);
    max-width: var(--max-width);
    bottom: initial;
    left: 50%;
    top: 50%;

    /* to be kept in sync with the transition styles */
    transform: translate(-50%, -50%);

    &[data-size=${sizeObj.small}] {
      min-width: min(480px, var(--max-width));
    }
    &[data-size=${sizeObj.medium}] {
      min-width: min(768px, var(--max-width));
    }
    &[data-size=${sizeObj.large}] {
      min-width: min(1120px, var(--max-width));
    }
  }
`
