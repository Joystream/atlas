import React, { useEffect } from 'react'
import { DialogBackDrop, StyledContainer, StyledExitButton } from './BaseDialog.style'
import { SvgGlyphClose } from '@/shared/icons'
import Portal from '@/components/Portal'
import { useOverlayManager } from '@/hooks'
import { CSSTransition } from 'react-transition-group'
import { transitions } from '@/shared/theme'

export type BaseDialogProps = {
  showDialog?: boolean
  exitButton?: boolean
  onExitClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  isActionDialog?: boolean
}

const BaseDialog: React.FC<BaseDialogProps> = ({ children, showDialog, exitButton = true, onExitClick, className }) => {
  const { dialogContainerRef, lockScroll, unlockScroll } = useOverlayManager()

  useEffect(() => {
    // don't lock if there is no children in dialogContainerRef
    if (!dialogContainerRef.current?.hasChildNodes()) {
      unlockScroll()
      return
    }
    // don't lock if there is only one dialog and it has ${transitions.names.dialog}-exit class
    const hasLastElementExitClassName = [...dialogContainerRef.current?.children]
      .filter((item) => item.className.includes(transitions.names.dialog))
      .every((item) => item.className.includes(`${transitions.names.dialog}-exit`))

    if (hasLastElementExitClassName) {
      unlockScroll()
      return
    }

    lockScroll()

    return () => {
      unlockScroll()
    }
  }, [dialogContainerRef, lockScroll, showDialog, unlockScroll])

  return (
    <Portal containerRef={dialogContainerRef}>
      <CSSTransition in={showDialog} timeout={200} classNames={transitions.names.fade} mountOnEnter unmountOnExit>
        <DialogBackDrop />
      </CSSTransition>
      <CSSTransition in={showDialog} timeout={200} classNames={transitions.names.dialog} mountOnEnter unmountOnExit>
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
