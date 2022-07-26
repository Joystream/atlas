import { FC } from 'react'

import { Dialog, DialogProps } from '@/components/_overlays/Dialog'
import { Modal, ModalProps } from '@/components/_overlays/Modal'

export type DialogModalProps = Pick<ModalProps, 'show' | 'size' | 'onClickOutside' | 'onEscPress'> &
  Omit<DialogProps, 'size'>

export const DialogModal: FC<DialogModalProps> = ({
  show,
  onExitClick,
  onClickOutside,
  onEscPress,
  size,
  children,
  ...dialogProps
}) => {
  return (
    <Modal
      show={show}
      onExitClick={onExitClick}
      onEscPress={onEscPress ? onEscPress : onExitClick || dialogProps.secondaryButton?.onClick}
      size={size}
      onClickOutside={onClickOutside}
    >
      <Dialog {...dialogProps} onExitClick={onExitClick}>
        {children}
      </Dialog>
    </Modal>
  )
}
