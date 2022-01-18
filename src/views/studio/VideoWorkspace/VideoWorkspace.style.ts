import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { VideoWorkspaceState } from '@/providers/videoWorkspace'
import { zIndex } from '@/styles'
import { cVar } from '@/styles'

import { VIDEO_WORKSPACE_TABS_BAR_HEIGHT } from './VideoWorkspaceTabsBar'

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

const containerStyles = (state: VideoWorkspaceState) => {
  if (state === 'minimized') {
    return css`
      transform: translateY(calc(100% - ${VIDEO_WORKSPACE_TABS_BAR_HEIGHT}px));
      opacity: 1;
    `
  }
  if (state === 'maximized') {
    return css`
      transform: translateY(0);
      opacity: 1;
    `
  }
  return css`
    transform: translateY(100%);
    opacity: 0;
  `
}

export const Container = styled.div<{ dialogState: VideoWorkspaceState }>`
  ${({ dialogState }) => containerStyles(dialogState)};
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
