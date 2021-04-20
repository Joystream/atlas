import { useSpring } from 'react-spring'
import { transitions } from '@/shared/theme'
import { EditVideoSheetState } from '@/hooks'
import { TOP_NAVBAR_HEIGHT } from '@/components'
import { EDIT_VIDEO_TABS_BAR_HEIGHT } from './EditVideoTabsBar'

export const useEditVideoSheetAnimations = (sheetState: EditVideoSheetState) => {
  const screenHeight = window.innerHeight
  const sheetHeight = screenHeight - TOP_NAVBAR_HEIGHT
  const sheetStateToTransform: Record<EditVideoSheetState, number> = {
    open: 0,
    minimized: sheetHeight - EDIT_VIDEO_TABS_BAR_HEIGHT,
    closed: sheetHeight,
  }

  const drawerOverlayAnimationProps = useSpring({
    duration: transitions.timings.sharp,
    opacity: sheetState === 'open' ? 1 : 0,
  })

  const sheetAnimationProps = useSpring({
    duration: transitions.timings.sharp,
    transform: `translateY(${sheetStateToTransform[sheetState]}px)`,
    opacity: sheetState === 'closed' ? 0 : 1,
  })

  return { drawerOverlayAnimationProps, sheetAnimationProps }
}
