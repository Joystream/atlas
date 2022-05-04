import React from 'react'

import { ConfirmationDialog, ConfirmationDialogProps } from '@/components/_overlays/ConfirmationDIalog'
import { Modal, ModalProps } from '@/components/_overlays/Modal'

export type ConfirmationDialogModalProps = Pick<ModalProps, 'show' | 'size'> & Omit<ConfirmationDialogProps, 'size'>

export const ConfirmationDialogModal: React.FC<ConfirmationDialogModalProps> = ({
  show,
  onExitClick,
  size,
  ...dialogProps
}) => {
  return (
    <Modal show={show} onExitClick={onExitClick} size={size}>
      <ConfirmationDialog {...dialogProps} onExitClick={onExitClick} />
    </Modal>
  )
}
