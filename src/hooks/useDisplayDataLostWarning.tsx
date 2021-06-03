import { useDialog } from './useDialog'

type OpenWarningDialogArgs = {
  onCancel?: () => void
  onConfirm?: () => void
}

export const useDisplayDataLostWarning = () => {
  const [openDialog, closeDialog] = useDialog()

  const cancelDialog = (onCancel?: () => void) => {
    onCancel?.()
  }

  const openWarningDialog = ({ onCancel, onConfirm }: OpenWarningDialogArgs) => {
    openDialog({
      title: "Drafts' video & image data will be lost",
      description:
        "Drafts' assets aren't stored permanently. If you proceed, you will need to reselect the files again.",
      primaryButtonText: 'Proceed',
      secondaryButtonText: 'Cancel',
      onPrimaryButtonClick: () => {
        onConfirm?.()
        closeDialog()
      },
      onSecondaryButtonClick: () => {
        cancelDialog(onCancel)
        closeDialog()
      },
      onExitClick: () => {
        cancelDialog(onCancel)
        closeDialog()
      },
      variant: 'warning',
    })
  }

  return {
    openWarningDialog,
  }
}
