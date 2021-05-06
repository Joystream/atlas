import { MessageDialog } from '@/components'
import React, { useState } from 'react'

type OpenWarningDialogArgs = {
  cancelCallback?: () => void
  confirmCallback?: () => void
}

export const useDisplayDataLostWarning = () => {
  const [lostDataDialogVisible, setLostDatadDialogVisible] = useState(false)
  const [confirmWarningCallback, setConfirmWarningCallback] = useState<undefined | (() => void)>()
  const [cancelWarningCallback, setCancelWarningCallback] = useState<undefined | (() => void)>()

  const openWarningDialog = ({ cancelCallback, confirmCallback }: OpenWarningDialogArgs) => {
    setLostDatadDialogVisible(true)
    setConfirmWarningCallback(confirmCallback)
    setCancelWarningCallback(cancelCallback)
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
      title="Video & image data will be lost"
      description="Drafts are stored locally and dont contain metadata for video and image file - if you abandon the proccess those files will have to be uploaded again."
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
    WarningDialog: renderWarning,
    openWarningDialog,
  }
}
