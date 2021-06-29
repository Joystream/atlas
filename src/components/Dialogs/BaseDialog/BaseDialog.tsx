import React, { useEffect } from 'react'
import { useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Portal } from '@/components'
import { useOverlayManager } from '@/providers'
import { SvgGlyphClose } from '@/shared/icons'
import { transitions } from '@/shared/theme'

import { DialogBackDrop, StyledContainer, StyledExitButton } from './BaseDialog.style'

export type BaseDialogProps = {
  showDialog?: boolean
  exitButton?: boolean
  onExitClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
}

export const BaseDialog: React.FC<BaseDialogProps> = ({
  children,
  showDialog,
  exitButton = true,
  onExitClick,
  className,
}) => {
  const { dialogContainerRef, incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()
  const [animationState, setAnimationState] = useState<'enter' | 'exit' | null>(null)

  useEffect(() => {
    if (animationState === 'enter') {
      incrementOverlaysOpenCount()
    }
    if (animationState === 'enter' && showDialog) {
      return () => {
        decrementOverlaysOpenCount()
      }
    }
  }, [animationState, decrementOverlaysOpenCount, incrementOverlaysOpenCount, showDialog])

  useEffect(() => {
    if (animationState === 'exit') {
      decrementOverlaysOpenCount()
    }
  }, [animationState, decrementOverlaysOpenCount])

  return (
    <Portal containerRef={dialogContainerRef}>
      <CSSTransition in={showDialog} timeout={200} classNames={transitions.names.fade} mountOnEnter unmountOnExit>
        <DialogBackDrop />
      </CSSTransition>
      <CSSTransition
        in={showDialog}
        onEnter={() => setAnimationState('enter')}
        timeout={200}
        classNames={transitions.names.dialog}
        mountOnEnter
        unmountOnExit
        onExited={() => setAnimationState('exit')}
      >
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
