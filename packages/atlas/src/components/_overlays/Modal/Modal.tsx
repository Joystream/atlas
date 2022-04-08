import React, { useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Portal } from '@/components/Portal'
import { useOverlayManager } from '@/providers/overlayManager'
import { transitions } from '@/styles'

import { ModalBackdrop, ModalContent } from './Modal.styles'

import { DialogProps } from '../Dialog'

export type ModalProps = {
  show?: boolean
  noBoxShadow?: boolean
  className?: string
} & Pick<DialogProps, 'onExitClick'>

export const Modal: React.FC<ModalProps> = ({ children, show, onExitClick, className, noBoxShadow }) => {
  const { modalContainerRef, incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()

  useEffect(() => {
    return () => {
      decrementOverlaysOpenCount()
    }
  }, [decrementOverlaysOpenCount])

  return (
    <Portal containerRef={modalContainerRef}>
      <CSSTransition in={show} timeout={250} classNames={transitions.names.fade} mountOnEnter unmountOnExit>
        <ModalBackdrop onClick={onExitClick} />
      </CSSTransition>
      <CSSTransition
        in={show}
        timeout={250}
        classNames={transitions.names.modal}
        mountOnEnter
        unmountOnExit
        appear
        onEnter={incrementOverlaysOpenCount}
        onExited={decrementOverlaysOpenCount}
      >
        <ModalContent noBoxShadow={noBoxShadow} className={className}>
          {children}
        </ModalContent>
      </CSSTransition>
    </Portal>
  )
}
