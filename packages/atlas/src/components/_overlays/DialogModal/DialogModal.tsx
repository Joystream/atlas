import React from 'react'

import { Dialog, DialogProps } from '@/components/_overlays/Dialog'
import { Modal, ModalProps } from '@/components/_overlays/Modal'

export type DialogModalProps = Pick<ModalProps, 'show'> & DialogProps

export const DialogModal: React.FC<DialogModalProps> = ({ show, ...dialogProps }) => {
  return (
    <Modal show={show}>
      <Dialog {...dialogProps} />
    </Modal>
  )
}
