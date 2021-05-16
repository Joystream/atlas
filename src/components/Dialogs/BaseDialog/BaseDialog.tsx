import React, { useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import { StyledContainer, StyledExitButton } from './BaseDialog.style'
import { transitions } from '@/shared/theme'
import { SvgGlyphClose } from '@/shared/icons'
import Portal from '@/components/Portal'
import { useOverlayManager } from '@/hooks'

export type BaseDialogProps = {
  showDialog?: boolean
  exitButton?: boolean
  onExitClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  isActionDialog?: boolean
}

const BaseDialog: React.FC<BaseDialogProps> = ({
  children,
  showDialog,
  exitButton = true,
  onExitClick,
  className,
  isActionDialog = true,
}) => {
  const {
    actionDialogContainerRef,
    lockScroll,
    unlockScroll,
    messageDialogContainerRef,
    closeOverlayContainerForActionDialog,
    openOverlayContainerForActionDialog,
  } = useOverlayManager()

  useEffect(() => {
    if (!showDialog || !isActionDialog) {
      return
    }
    lockScroll()
    openOverlayContainerForActionDialog()
    return () => {
      unlockScroll()
      closeOverlayContainerForActionDialog()
    }
  }, [
    lockScroll,
    unlockScroll,
    showDialog,
    isActionDialog,
    openOverlayContainerForActionDialog,
    closeOverlayContainerForActionDialog,
  ])

  return (
    <Portal containerRef={isActionDialog ? actionDialogContainerRef : messageDialogContainerRef}>
      {isActionDialog ? (
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
