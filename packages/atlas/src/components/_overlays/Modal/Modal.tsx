import { FC, MouseEvent, PropsWithChildren, useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { confettiAnimation } from '@/assets/animations'
import { LottiePlayer } from '@/components/LottiePlayer'
import { Portal } from '@/components/Portal'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useOverlayManager } from '@/providers/overlayManager'
import { cVar, transitions } from '@/styles'

import { ConfettiWrapper, ModalBackdrop, ModalContent, ModalSize } from './Modal.styles'

import { DialogProps } from '../Dialog'

export type ModalProps = PropsWithChildren<{
  show?: boolean
  confetti?: boolean
  noBoxShadow?: boolean
  size?: ModalSize
  onClickOutside?: (event?: MouseEvent) => void
  className?: string
  disableBackdropAnimation?: boolean
}> &
  Pick<DialogProps, 'onExitClick' | 'additionalActionsNode' | 'additionalActionsNodeMobilePosition'>

export const Modal: FC<ModalProps> = ({
  children,
  size = 'small',
  show,
  onClickOutside,
  className,
  noBoxShadow,
  disableBackdropAnimation,
  confetti,
}) => {
  const { modalContainerRef, incrementOverlaysOpenCount, decrementOverlaysOpenCount, lastOverlayId } =
    useOverlayManager()
  const [overlayId, setOverlayId] = useState<string | null>(null)

  useEffect(() => {
    if (!onClickOutside) {
      return
    }
    const handleEscPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lastOverlayId === overlayId) {
          onClickOutside?.()
        }
      }
    }
    document.addEventListener('keydown', handleEscPress)

    return () => {
      document.removeEventListener('keydown', handleEscPress)
    }
  }, [lastOverlayId, onClickOutside, overlayId])

  useMountEffect(() => {
    return () => {
      decrementOverlaysOpenCount()
    }
  })

  return (
    <Portal containerRef={modalContainerRef}>
      {disableBackdropAnimation ? (
        show && <ModalBackdrop onClick={onClickOutside} />
      ) : (
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
      )}
      {confetti && (
        <CSSTransition
          in={show}
          timeout={parseInt(cVar('animationTimingMedium', true))}
          classNames={transitions.names.fade}
          mountOnEnter
          unmountOnExit
          appear
        >
          <ConfettiWrapper>
            <LottiePlayer data={confettiAnimation} />
          </ConfettiWrapper>
        </CSSTransition>
      )}
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
