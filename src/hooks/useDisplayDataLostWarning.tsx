import { MessageDialog } from '@/components'
import React, { useState } from 'react'

type OpenWarningDialogArgs = {
  onCancel?: () => void
  onConfirm?: () => void
}

export const useDisplayDataLostWarning = () => {
  const [lostDataDialogVisible, setLostDatadDialogVisible] = useState(false)
  const [confirmWarningCallback, setConfirmWarningCallback] = useState<undefined | (() => void)>()
  const [cancelWarningCallback, setCancelWarningCallback] = useState<undefined | (() => void)>()

  const openWarningDialog = ({ onCancel, onConfirm }: OpenWarningDialogArgs) => {
    setLostDatadDialogVisible(true)
    setConfirmWarningCallback(() => onConfirm)
    setCancelWarningCallback(() => onCancel)
  }

  const confirmCloseSheet = () => {
    setLostDatadDialogVisible(false)
    confirmWarningCallback?.()
  }

  const cancelCloseSheet = () => {
    setLostDatadDialogVisible(false)
    cancelWarningCallback?.()
  }

  const renderWarning = () => (
    <MessageDialog
      title="Drafts' video & image data will be lost"
      description="Drafts' assets aren't stored permanently. If you proceed, you will need to reselect the files again."
      primaryButtonText="Proceed"
      showDialog={lostDataDialogVisible}
      onPrimaryButtonClick={confirmCloseSheet}
      onSecondaryButtonClick={cancelCloseSheet}
      onExitClick={cancelCloseSheet}
      secondaryButtonText="Cancel"
      variant="warning"
    />
  )
  return {
    DataLostWarningDialog: renderWarning,
    openWarningDialog,
  }
}
