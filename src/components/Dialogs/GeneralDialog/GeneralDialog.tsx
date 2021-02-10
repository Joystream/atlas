import React, { useEffect } from 'react'
import { Portal } from '@/components'
import { useOverlayManager } from '@/hooks/useOverlayManager'
import { CSSTransition } from 'react-transition-group'
import { StyledBackdrop, StyledContainer, StyledExitButton, dialogTransitions } from './GeneralDialog.style'
import { Icon } from '@/shared/components'

export type DialogProps = {
  showDialog?: boolean
  exitButton?: boolean
  handleExit?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const GeneralDialog: React.FC<DialogProps> = ({ children, showDialog, exitButton, handleExit }) => {
  const { overlayContainerRef, handleOverlayOpen, handleOverlayClose } = useOverlayManager()

  useEffect(() => {
    if (!showDialog) {
      return
    }
    handleOverlayOpen()
    return () => {
      handleOverlayClose()
    }
  }, [handleOverlayClose, handleOverlayOpen, showDialog])
  return (
    overlayContainerRef.current && (
      <Portal portal={overlayContainerRef}>
        <CSSTransition in={showDialog} timeout={250} classNames="backdrop" unmountOnExit mountOnEnter>
          <StyledBackdrop css={dialogTransitions} className="backdrop">
            <StyledContainer className="dialog">
              {exitButton && (
                <StyledExitButton aria-label="close dialog" onClick={handleExit}>
                  <Icon name="times-white" />
                </StyledExitButton>
              )}
              {children}
            </StyledContainer>
          </StyledBackdrop>
        </CSSTransition>
      </Portal>
    )
  )
}

export default GeneralDialog
