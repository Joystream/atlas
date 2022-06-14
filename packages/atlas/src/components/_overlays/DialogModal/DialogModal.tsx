import { FC } from 'react'

import { Dialog, DialogProps } from '@/components/_overlays/Dialog'
import { Modal, ModalProps } from '@/components/_overlays/Modal'

export type DialogModalProps = Pick<ModalProps, 'show' | 'size'> & Omit<DialogProps, 'size'>

export const DialogModal: FC<DialogModalProps> = ({ show, onExitClick, size, children, ...dialogProps }) => {
  return (
    <Modal show={show} onExitClick={onExitClick} size={size}>
      <Dialog {...dialogProps} onExitClick={onExitClick}>
        {children}
      </Dialog>
    </Modal>
  )
}
