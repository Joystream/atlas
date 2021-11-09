import React from 'react'

import { Modal, ModalProps } from '@/components/Modal'
import { Dialog, DialogProps } from '@/shared/components/Dialog'

export type DialogModalProps = Pick<ModalProps, 'show'> & DialogProps

export const DialogModal: React.FC<DialogModalProps> = ({ show, ...dialogProps }) => {
  return (
    <Modal show={show}>
      <Dialog {...dialogProps} />
    </Modal>
  )
}
