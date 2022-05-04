import { useCallback } from 'react'

import { useConfirmationModal } from '@/providers/confirmationModal'

type OpenWarningDialogArgs = {
  onCancel?: () => void
  onConfirm?: () => void
}

export const useDisplayDataLostWarning = () => {
  const { openConfirmationModal, closeModal } = useConfirmationModal()

  const cancelDialog = (onCancel?: () => void) => {
    onCancel?.()
  }

  const openWarningDialog = useCallback(
    ({ onCancel, onConfirm }: OpenWarningDialogArgs) => {
      openConfirmationModal({
        title: "Drafts' video & image data will be lost",
        description:
          "Drafts' assets aren't stored permanently. If you proceed, you will need to reselect the files again.",
        primaryButton: {
          text: 'Proceed',
          onClick: () => {
            onConfirm?.()
            closeModal()
          },
        },
        secondaryButton: {
          text: 'Cancel',
          onClick: () => {
            cancelDialog(onCancel)
            closeModal()
          },
        },
        onExitClick: () => {
          cancelDialog(onCancel)
          closeModal()
        },
        iconType: 'warning',
      })
    },
    [closeModal, openConfirmationModal]
  )

  return {
    openWarningDialog,
  }
}
