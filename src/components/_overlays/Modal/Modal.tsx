import React, { useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Portal } from '@/components/Portal'
import { useOverlayManager } from '@/providers/overlayManager'
import { transitions } from '@/styles'

import { ModalBackdrop, ModalContent } from './Modal.styles'

export type ModalProps = {
  show?: boolean
  className?: string
}

export const Modal: React.FC<ModalProps> = ({ children, show, className }) => {
  const { modalContainerRef, incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()

  useEffect(() => {
    return () => {
      decrementOverlaysOpenCount()
    }
  }, [decrementOverlaysOpenCount])

  return (
    <Portal containerRef={modalContainerRef}>
      <CSSTransition in={show} timeout={200} classNames={transitions.names.fade} mountOnEnter unmountOnExit>
        <ModalBackdrop />
      </CSSTransition>
      <CSSTransition
        in={show}
        timeout={200}
        classNames={transitions.names.modal}
        mountOnEnter
        unmountOnExit
        appear
        onEnter={incrementOverlaysOpenCount}
        onExited={decrementOverlaysOpenCount}
      >
        <ModalContent className={className}>{children}</ModalContent>
      </CSSTransition>
    </Portal>
  )
}
