import { useSpring } from 'react-spring'
import { transitions } from '@/shared/theme'
import { useEffect } from 'react'
import { EditVideoSheetState } from '@/hooks'
import { TOP_NAVBAR_HEIGHT } from '@/components'
import { ACTION_SHEET_BAR_HEIGHT } from './EditVideoSheet.style'

const screenHeight = window.innerHeight
const sheetHeight = screenHeight - TOP_NAVBAR_HEIGHT
const minimizedSheetHeight = ACTION_SHEET_BAR_HEIGHT

export const useEditVideoSheetAnimations = (sheetState: EditVideoSheetState) => {
  const [drawerOverlayAnimationProps, setDrawerOverlayAnimationProps] = useSpring(() => ({
    duration: transitions.timings.sharp,
    opacity: '0',
  }))
  useEffect(() => {
    if (sheetState === 'open') setDrawerOverlayAnimationProps({ opacity: 1 })
    if (sheetState === 'minimized') setDrawerOverlayAnimationProps({ opacity: 0 })
    if (sheetState === 'closed') setDrawerOverlayAnimationProps({ opacity: 0 })
  }, [setDrawerOverlayAnimationProps, sheetState])

  const [sheetAnimationProps, setSheetAnimationProps] = useSpring(() => ({
    duration: transitions.timings.sharp,
    transform: `translateY(${sheetHeight}px)`,
    opacity: 1,
  }))
  useEffect(() => {
    if (sheetState === 'open') setSheetAnimationProps({ transform: 'translateY(0)', opacity: 1 })
    if (sheetState === 'minimized')
      setSheetAnimationProps({ transform: `translateY(${sheetHeight - minimizedSheetHeight}px)`, opacity: 1 })
    if (sheetState === 'closed') setSheetAnimationProps({ transform: `translateY(${sheetHeight}px)`, opacity: 0 })
  }, [setSheetAnimationProps, sheetState])

  return { drawerOverlayAnimationProps, sheetAnimationProps }
}
