import { useDialog } from './useDialog'

type OpenWarningDialogArgs = {
  onCancel?: () => void
  onConfirm?: () => void
}

const DATA_LOST_DIALOG = 'DATA_LOST_DIALOG'

export const useDisplayDataLostWarning = () => {
  const { openDialog } = useDialog()

  const cancelDialog = (onCancel?: () => void) => {
    onCancel?.()
  }

  const openWarningDialog = ({ onCancel, onConfirm }: OpenWarningDialogArgs) => {
    openDialog(DATA_LOST_DIALOG, {
      title: "Drafts' video & image data will be lost",
      description:
        "Drafts' assets aren't stored permanently. If you proceed, you will need to reselect the files again.",
      primaryButtonText: 'Proceed',
      secondaryButtonText: 'Cancel',
      onPrimaryButtonClick: () => {
        onConfirm?.()
      },
      onSecondaryButtonClick: () => {
        cancelDialog(onCancel)
      },
      onExitClick: () => {
        cancelDialog(onCancel)
      },
      variant: 'warning',
    })
  }

  return {
    openWarningDialog,
  }
}
