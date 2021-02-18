import React, { useEffect } from 'react'
import { Portal } from '@/components'
import { useOverlayManager } from '@/hooks/useOverlayManager'
import { CSSTransition } from 'react-transition-group'
import { StyledContainer, StyledExitButton } from './GeneralDialog.style'
import { Icon } from '@/shared/components'
import { transitions } from '@/shared/theme'

export type DialogProps = {
  showDialog?: boolean
  exitButton?: boolean
  className?: string
  handleExit?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const GeneralDialog: React.FC<DialogProps> = ({ children, showDialog, exitButton, handleExit, className }) => {
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
      <CSSTransition in={showDialog} timeout={250} classNames={transitions.names.dialog}>
        <StyledContainer className={className}>
          {exitButton && (
            <StyledExitButton aria-label="close dialog" onClick={handleExit}>
              <Icon name="times" color="white" />
            </StyledExitButton>
          )}
          {children}
        </StyledContainer>
      </CSSTransition>
    </Portal>
  )
}

export default GeneralDialog
