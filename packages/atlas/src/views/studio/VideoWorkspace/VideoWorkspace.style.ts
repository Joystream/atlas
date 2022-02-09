import styled from '@emotion/styled'

import { zIndex } from '@/styles'
import { cVar } from '@/styles'

export const DrawerOverlay = styled.div`
  position: fixed;
  z-index: ${zIndex.videoWorkspaceOverlay};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${cVar('colorBackgroundOverlay')};
  transition: opacity ${cVar('animationTransitionSlow')};

  &.video-workspace-drawer-enter-active,
  &.video-workspace-drawer-exit {
    opacity: 1;
    pointer-events: initial;
  }

  &.video-workspace-drawer-enter,
  &.video-workspace-drawer-exit-active {
    opacity: 0;
    pointer-events: none;
  }
`

export const Container = styled.div`
  transform: translateY(100%);
  opacity: 0;
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
  transition: transform ${cVar('animationTransitionSlow')}, opacity ${cVar('animationTransitionSlow')};
  will-change: transform, opacity;

  &.video-workspace {
    &-exit,
    &-enter-active,
    &-enter-done {
      opacity: 1;
      transform: translateY(0);
    }

    &-enter,
    &-exit-active {
      transform: translateY(100%);
      opacity: 0;
    }
  }
`
