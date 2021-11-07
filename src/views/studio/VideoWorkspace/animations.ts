import { useSpring } from 'react-spring'
import useMeasure from 'react-use-measure'

import { VideoWorkspaceState } from '@/providers/videoWorkspace'
import { transitions } from '@/theme'

import { VIDEO_WORKSPACE_TABS_BAR_HEIGHT } from './VideoWorkspaceTabsBar'

export const useVideoWorkspaceAnimations = (videoWorkspaceState: VideoWorkspaceState) => {
  const [containerRef, containerBounds] = useMeasure()
  // 1 extra px to account for the border
  const minimizedTransform = containerBounds.height
    ? containerBounds.height - VIDEO_WORKSPACE_TABS_BAR_HEIGHT + 1
    : 10000
  const videoWorkspaceStateToTransform: Record<VideoWorkspaceState, number> = {
    open: 0,
    minimized: minimizedTransform,
    closed: containerBounds.height,
  }

  const drawerOverlayAnimationProps = useSpring({
    duration: transitions.timings.sharp,
    opacity: videoWorkspaceState === 'open' ? 1 : 0,
    pointerEvents: videoWorkspaceState === 'open' ? ('initial' as const) : ('none' as const),
  })

  const videoWorkspaceAnimationProps = useSpring({
    duration: transitions.timings.sharp,
    transform: `translateY(${videoWorkspaceStateToTransform[videoWorkspaceState]}px)`,
    opacity: videoWorkspaceState === 'closed' ? 0 : 1,
  })

  return { containerRef, drawerOverlayAnimationProps, videoWorkspaceAnimationProps }
}
