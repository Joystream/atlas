import { FC, MouseEvent, PropsWithChildren, useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Portal } from '@/components/Portal'
import { useOverlayManager } from '@/providers/overlayManager'
import { cVar, transitions } from '@/styles'

import { ModalBackdrop, ModalContent, ModalSize } from './Modal.styles'

import { DialogProps } from '../Dialog'

export type ModalProps = PropsWithChildren<{
  show?: boolean
  noBoxShadow?: boolean
  size?: ModalSize
  onClickOutside?: (event?: MouseEvent) => void
  onEscPress?: () => void
  className?: string
}> &
  Pick<DialogProps, 'onExitClick' | 'additionalActionsNode'>

export const Modal: FC<ModalProps> = ({
  children,
  size = 'small',
  show,
  onClickOutside,
  onEscPress,
  className,
  noBoxShadow,
}) => {
  const { modalContainerRef, incrementOverlaysOpenCount, decrementOverlaysOpenCount, lastOverlayId } =
    useOverlayManager()
  const [overlayId, setOverlayId] = useState<string | null>(null)

  useEffect(() => {
    if (!onEscPress) {
      return
    }
    const handleEscPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lastOverlayId === overlayId) {
          onEscPress?.()
        }
      }
    }
    document.addEventListener('keydown', handleEscPress)

    return () => {
      document.removeEventListener('keydown', handleEscPress)
    }
  }, [lastOverlayId, onEscPress, overlayId])

  return (
    <Portal containerRef={modalContainerRef}>
      <CSSTransition
        in={show}
        timeout={parseInt(cVar('animationTimingMedium', true))}
        classNames={transitions.names.fade}
        mountOnEnter
        unmountOnExit
        appear
      >
        <ModalBackdrop onClick={onClickOutside} />
      </CSSTransition>
      <CSSTransition
        in={show}
        timeout={parseInt(cVar('animationTimingMedium', true))}
        classNames={transitions.names.modal}
        mountOnEnter
        unmountOnExit
        appear
        onEnter={() => {
          const id = incrementOverlaysOpenCount()
          setOverlayId(id)
        }}
        onExited={decrementOverlaysOpenCount}
      >
        <ModalContent data-size={size} noBoxShadow={noBoxShadow} className={className}>
          {children}
        </ModalContent>
      </CSSTransition>
    </Portal>
  )
}
