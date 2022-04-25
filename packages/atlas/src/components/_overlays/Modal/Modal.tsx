import React, { useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Portal } from '@/components/Portal'
import { useOverlayManager } from '@/providers/overlayManager'
import { cVar, transitions } from '@/styles'

import { ModalBackdrop, ModalContent, ModalSize } from './Modal.styles'

import { DialogProps } from '../Dialog'

export type ModalProps = {
  show?: boolean
  noBoxShadow?: boolean
  size?: ModalSize
  className?: string
} & Pick<DialogProps, 'onExitClick'>

export const Modal: React.FC<ModalProps> = ({
  children,
  size = 'small',
  show,
  onExitClick,
  className,
  noBoxShadow,
}) => {
  const { modalContainerRef, incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()

  useEffect(() => {
    return () => {
      decrementOverlaysOpenCount()
    }
  }, [decrementOverlaysOpenCount])

  return (
    <Portal containerRef={modalContainerRef}>
      <CSSTransition
        in={show}
        timeout={parseInt(cVar('animationTimingMedium', true))}
        classNames={transitions.names.fade}
        mountOnEnter
        unmountOnExit
      >
        <ModalBackdrop onClick={onExitClick} />
      </CSSTransition>
      <CSSTransition
        in={show}
        timeout={parseInt(cVar('animationTimingMedium', true))}
        classNames={transitions.names.modal}
        mountOnEnter
        unmountOnExit
        appear
        onEnter={incrementOverlaysOpenCount}
        onExited={decrementOverlaysOpenCount}
      >
        <ModalContent data-size={size} noBoxShadow={noBoxShadow} className={className}>
          {children}
        </ModalContent>
      </CSSTransition>
    </Portal>
  )
}
