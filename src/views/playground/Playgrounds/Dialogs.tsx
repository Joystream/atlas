import { ActionDialog } from '@/components'
import { useDialog } from '@/hooks/useDialog'
import { Button } from '@/shared/components'
import React from 'react'

const Dialogs = () => {
  const [openFirstDialog, closeFirstDialog] = useDialog({
    description: 'This is first dialog',
    title: 'first dialog',
    primaryButtonText: 'Confirm',
    onExitClick: () => closeFirstDialog(),
  })

  const [openSecondDialog, closeSecondDialog] = useDialog({
    description: 'This is second dialog',
    title: 'second dialog',
    primaryButtonText: 'Confirm',
    onExitClick: () => closeSecondDialog(),
  })

  const [openThirdDialog, closeThirdDialog] = useDialog({
    description: 'This is third dialog',
    title: 'third dialog',
    primaryButtonText: 'Confirm',
    onExitClick: () => closeThirdDialog(),
  })

  const [openActionDialog, closeActionDialog] = useDialog(() => (
    <ActionDialog onExitClick={() => closeActionDialog()}>
      <div>hello from ActionDialog</div>
    </ActionDialog>
  ))

  return (
    // to test lock/unlock scroll
    <div style={{ height: '200vh' }}>
      <Button onClick={() => openFirstDialog()}>Open Dialog</Button>
      <Button
        onClick={() => {
          openSecondDialog()
          openThirdDialog()
        }}
      >
        Open two dialogs at once
      </Button>
      <Button
        onClick={() => {
          openActionDialog()
        }}
      >
        Open action dialog
      </Button>
    </div>
  )
}

export default Dialogs
