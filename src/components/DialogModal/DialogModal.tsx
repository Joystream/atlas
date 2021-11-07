import React from 'react'

import { Dialog, DialogProps } from '@/components/Dialog'
import { Modal, ModalProps } from '@/components/Modal'

export type DialogModalProps = Pick<ModalProps, 'show'> & DialogProps

export const DialogModal: React.FC<DialogModalProps> = ({ show, ...dialogProps }) => {
  return (
    <Modal show={show}>
      <Dialog {...dialogProps} />
    </Modal>
  )
}
