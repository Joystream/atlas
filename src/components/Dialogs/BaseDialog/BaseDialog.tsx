import React, { useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import { DialogBackDrop, StyledContainer, StyledExitButton } from './BaseDialog.style'
import { transitions } from '@/shared/theme'
import { SvgGlyphClose } from '@/shared/icons'
import Portal from '@/components/Portal'
import { useOverlayManager } from '@/hooks'

export type BaseDialogProps = {
  showDialog?: boolean
  exitButton?: boolean
  onExitClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  withSingleDialogAnimation?: boolean
}

const BaseDialog: React.FC<BaseDialogProps> = ({
  children,
  showDialog,
  exitButton = true,
  onExitClick,
  className,
  withSingleDialogAnimation = true,
}) => {
  const { dialogPortalRef, lockScroll, unlockScroll, overlayContainerRef } = useOverlayManager()
  useEffect(() => {
    if (!showDialog) {
      return
    }
    lockScroll()
    return () => {
      unlockScroll()
    }
  }, [lockScroll, unlockScroll, showDialog])

  return (
    <Portal containerRef={withSingleDialogAnimation ? dialogPortalRef : overlayContainerRef}>
      {withSingleDialogAnimation ? (
        <DialogBackDrop isOpened={showDialog}>
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
        </DialogBackDrop>
      ) : (
        <StyledContainer className={className}>
          {exitButton && (
            <StyledExitButton aria-label="close dialog" onClick={onExitClick} variant="tertiary">
              <SvgGlyphClose />
            </StyledExitButton>
          )}
          {children}
        </StyledContainer>
      )}
    </Portal>
  )
}

export default BaseDialog
