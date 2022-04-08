import React from 'react'

import { Dialog, DialogProps } from '@/components/_overlays/Dialog'
import { Modal, ModalProps } from '@/components/_overlays/Modal'

export type DialogModalProps = Pick<ModalProps, 'show'> & DialogProps

export const DialogModal: React.FC<DialogModalProps> = ({ show, onExitClick, ...dialogProps }) => {
  return (
    <Modal show={show} onExitClick={onExitClick}>
      <Dialog {...dialogProps} onExitClick={onExitClick} />
    </Modal>
  )
}
