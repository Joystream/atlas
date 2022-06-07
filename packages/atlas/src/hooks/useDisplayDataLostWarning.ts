import { useCallback } from 'react'

import { useConfirmationModal } from '@/providers/confirmationModal'

type OpenWarningDialogArgs = {
  onCancel?: () => void
  onConfirm?: () => void
}

export const useDisplayDataLostWarning = () => {
  const [openDialog, closeDialog] = useConfirmationModal()

  const cancelDialog = (onCancel?: () => void) => {
    onCancel?.()
  }

  const openWarningDialog = useCallback(
    ({ onCancel, onConfirm }: OpenWarningDialogArgs) => {
      openDialog({
        title: "Drafts' video & image data will be lost",
        description:
          "Drafts' assets aren't stored permanently. If you proceed, you will need to reselect the files again.",
        primaryButton: {
          text: 'Proceed',
          onClick: () => {
            onConfirm?.()
            closeDialog()
          },
        },
        secondaryButton: {
          text: 'Cancel',
          onClick: () => {
            cancelDialog(onCancel)
            closeDialog()
          },
        },
        onExitClick: () => {
          cancelDialog(onCancel)
          closeDialog()
        },
        type: 'warning',
      })
    },
    [closeDialog, openDialog]
  )

  return {
    openWarningDialog,
  }
}
