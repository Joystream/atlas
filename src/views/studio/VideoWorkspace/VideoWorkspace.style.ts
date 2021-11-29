import styled from '@emotion/styled'
import { animated } from 'react-spring'

import { VideoWorkspaceState } from '@/providers/videoWorkspace'
import { oldColors, transitions, zIndex } from '@/styles'
import { VIDEO_WORKSPACE_TABS_BAR_HEIGHT } from '@/views/studio/VideoWorkspace/VideoWorkspaceTabsBar'

export const DrawerOverlay = styled(animated.div)`
  position: fixed;
  z-index: ${zIndex.videoWorkspaceOverlay};
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: ${oldColors.transparentBlack[54]};
  transition: opacity 200ms ${transitions.easing};

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

export const Container = styled.div<{ state: VideoWorkspaceState }>`
  position: fixed;
  z-index: ${zIndex.videoWorkspaceOverlay};
  top: var(--size-topbar-height);
  left: var(--size-sidenav-width-collapsed);
  right: 0;
  height: calc(100vh - var(--size-topbar-height));
  display: flex;
  flex-direction: column;
  background-color: ${oldColors.gray[900]};
  box-shadow: 0 4px 52px ${oldColors.black};
  opacity: 1;
  transform: translateY(0);
  transition: top ${transitions.timings.routing} ${transitions.easing};

  &.video-workspace {
    &-exit,
    &-enter-active,
    &-enter-done {
      opacity: 1;
      transform: translateY(0);
      transition: all ${transitions.timings.routing} ${transitions.easing};
    }

    &-enter,
    &-exit-active {
      transform: translateY(100%);
      opacity: 0;
    }

    &--minimized {
      top: calc(100% - ${VIDEO_WORKSPACE_TABS_BAR_HEIGHT}px - 1px);
    }
  }
`
