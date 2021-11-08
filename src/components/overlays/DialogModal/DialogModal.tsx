import React from 'react'

import { Dialog, DialogProps } from '@/components/overlays/Dialog'
import { Modal, ModalProps } from '@/components/overlays/Modal'

export type DialogModalProps = Pick<ModalProps, 'show'> & DialogProps

export const DialogModal: React.FC<DialogModalProps> = ({ show, ...dialogProps }) => {
  return (
    <Modal show={show}>
      <Dialog {...dialogProps} />
    </Modal>
  )
}
