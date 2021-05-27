import React, { useEffect } from 'react'
import { Portal } from '@/components'
import { useOverlayManager } from '@/hooks/useOverlayManager'
import { CSSTransition } from 'react-transition-group'
import { StyledContainer, StyledExitButton } from './BaseDialog.style'
import { transitions } from '@/shared/theme'
import { SvgGlyphClose } from '@/shared/icons'

export type BaseDialogProps = {
  showDialog?: boolean
  exitButton?: boolean
  onExitClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
}

const BaseDialog: React.FC<BaseDialogProps> = ({ children, showDialog, exitButton = true, onExitClick, className }) => {
  const {
    overlayContainerRef,
    lockScroll,
    unlockScroll,
    openOverlayContainer,
    closeOverlayContainer,
  } = useOverlayManager()

  useEffect(() => {
    if (!showDialog) {
      return
    }
    lockScroll()
    openOverlayContainer()
    return () => {
      unlockScroll()
      closeOverlayContainer()
    }
  }, [showDialog, lockScroll, unlockScroll, openOverlayContainer, closeOverlayContainer])

  return (
    <Portal containerRef={overlayContainerRef}>
      <CSSTransition in={showDialog} timeout={250} classNames={transitions.names.dialog} mountOnEnter unmountOnExit>
        <StyledContainer className={className}>
          {exitButton && (
            <StyledExitButton aria-label="close dialog" onClick={onExitClick} variant="tertiary">
              <SvgGlyphClose />
            </StyledExitButton>
          )}
          {children}
        </StyledContainer>
      </CSSTransition>
    </Portal>
  )
}

export default BaseDialog
