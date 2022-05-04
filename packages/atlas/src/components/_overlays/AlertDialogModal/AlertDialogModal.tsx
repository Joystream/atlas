import React from 'react'

import { AlertDialog, AlertDialogProps } from '@/components/_overlays/AlertDialog'
import { Modal, ModalProps } from '@/components/_overlays/Modal'

export type AlertDialogModalProps = Pick<ModalProps, 'show'> & AlertDialogProps

export const AlertDialogModal: React.FC<AlertDialogModalProps> = ({ show, ...dialogProps }) => {
  return (
    <Modal show={show}>
      <AlertDialog {...dialogProps} />
    </Modal>
  )
}
