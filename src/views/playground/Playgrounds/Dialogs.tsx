import { TransactionDialog } from '@/components'
import { useDialog } from '@/hooks'
import { ExtrinsicStatus } from '@/joystream-lib'
import { Button } from '@/shared/components'
import React, { useEffect, useState } from 'react'

const Dialogs = () => {
  const { openDialog, closeDialog } = useDialog()
  const [status, setStatus] = useState<null | ExtrinsicStatus.ProcessingAssets>(ExtrinsicStatus.ProcessingAssets)

  useEffect(() => {
    // just to test two dialogs open at once
    openDialog('useEffectDialog', {
      description: 'asdasdasg',
      title: 'First dialog with useEffect',
      primaryButtonText: 'Confirm',
    })
    openDialog('useEffectDialog3', {
      description: 'Second dialog with useEffect',
      title: 'Second dialog',
      primaryButtonText: 'Confirm',
    })
  }, [openDialog])

  return (
    // to test lock/unlock scroll
    <div style={{ height: '200vh' }}>
      <Button
        onClick={() => {
          openDialog('firstDialog', {
            description: 'This is first dialog',
            title: 'First dialog',
            primaryButtonText: 'Confirm',
          })
        }}
      >
        Open Dialog
      </Button>
      <Button
        onClick={() => {
          openDialog('secondDialog', {
            description: 'This is second dialog',
            title: 'Second dialog',
            primaryButtonText: 'Confirm',
          })
        }}
      >
        Open second dialog
      </Button>
      <Button
        onClick={() => {
          closeDialog('dialogIdWhichDontExist')
        }}
      >
        Close dialog which dont exists and check the console
      </Button>
      <TransactionDialog status={status} onClose={() => setStatus(null)} />
    </div>
  )
}

export default Dialogs
