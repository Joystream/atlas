import React, { useEffect } from 'react'
import { Portal } from '@/components'
import { useOverlayManager } from '@/hooks/useOverlayManager'
import { CSSTransition } from 'react-transition-group'
import { StyledContainer, StyledExitButton, dialogTransitions } from './GeneralDialog.style'
import { Icon } from '@/shared/components'

export type DialogProps = {
  showDialog?: boolean
  exitButton?: boolean
  handleExit?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const GeneralDialog: React.FC<DialogProps> = ({ children, showDialog, exitButton, handleExit }) => {
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
      <CSSTransition in={showDialog} timeout={250} classNames="dialog" css={dialogTransitions}>
        <StyledContainer className="dialog">
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
