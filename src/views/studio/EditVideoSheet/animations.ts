import { useSpring } from 'react-spring'
import useMeasure from 'react-use-measure'

import { EditVideoSheetState } from '@/providers/editVideoSheet'
import { transitions } from '@/shared/theme'

import { EDIT_VIDEO_TABS_BAR_HEIGHT } from './EditVideoTabsBar'

export const useEditVideoSheetAnimations = (sheetState: EditVideoSheetState) => {
  const [containerRef, containerBounds] = useMeasure()
  // 1 extra px to account for the border
  const minimizedTransform = containerBounds.height ? containerBounds.height - EDIT_VIDEO_TABS_BAR_HEIGHT + 1 : 10000
  const sheetStateToTransform: Record<EditVideoSheetState, number> = {
    open: 0,
    minimized: minimizedTransform,
    closed: containerBounds.height,
  }

  const drawerOverlayAnimationProps = useSpring({
    duration: transitions.timings.sharp,
    opacity: sheetState === 'open' ? 1 : 0,
    pointerEvents: sheetState === 'open' ? 'initial' : 'none',
  })

  const sheetAnimationProps = useSpring({
    duration: transitions.timings.sharp,
    transform: `translateY(${sheetStateToTransform[sheetState]}px)`,
    opacity: sheetState === 'closed' ? 0 : 1,
  })

  return { containerRef, drawerOverlayAnimationProps, sheetAnimationProps }
}
