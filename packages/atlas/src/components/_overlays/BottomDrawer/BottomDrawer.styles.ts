import styled from '@emotion/styled'

import { cVar, zIndex } from '@/styles'

export const DrawerOverlay = styled.div`
  position: fixed;
  z-index: ${zIndex.videoWorkspaceOverlay};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${cVar('colorBackgroundOverlay')};
  pointer-events: none;

  &.bottom-drawer-overlay {
    &-enter,
    &-appear {
      opacity: 0;
    }

    &-exit,
    &-enter-done {
      opacity: 1;
    }

    &-enter-active,
    &-appear-active {
      opacity: 1;
      transition: opacity ${cVar('animationTransitionSlow')};
    }

    &-exit-active {
      opacity: 0;
      transition: opacity ${cVar('animationTransitionSlow')};
    }
  }
`

export const Container = styled.div`
  position: fixed;
  z-index: ${zIndex.videoWorkspaceOverlay};
  top: var(--size-topbar-height);
  left: 0;
  right: 0;
  height: calc(100vh - var(--size-topbar-height));
  display: flex;
  flex-direction: column;
  background-color: ${cVar('colorBackground')};
  box-shadow: ${cVar('effectElevation24Layer1')}, ${cVar('effectElevation24Layer2')};

  &.bottom-drawer {
    &-enter {
      opacity: 0;
      transform: translateY(100%);
    }

    &-enter-active {
      opacity: 1;
      transform: translateY(0);
      transition: transform ${cVar('animationTransitionSlow')}, opacity ${cVar('animationTransitionSlow')};
    }

    &-exit,
    &-enter-done {
      opacity: 1;
      transform: translateY(0);
    }

    &-exit-active {
      opacity: 0;
      transform: translateY(100%);
      transition: transform ${cVar('animationTransitionSlow')}, opacity ${cVar('animationTransitionSlow')};
    }
  }
`

export const Outer = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
`

export const Inner = styled.div<{ fixedScrollbar?: boolean }>`
  position: absolute;
  inset: 0;
  overflow-x: hidden;
  overflow-y: ${({ fixedScrollbar }) => (fixedScrollbar ? 'scroll' : 'auto')};
`
