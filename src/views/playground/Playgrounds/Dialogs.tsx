import React from 'react'

import { useDialog } from '@/providers/dialogs'
import { Button } from '@/shared/components'

export const Dialogs = () => {
  const [openFirstDialog, closeFirstDialog] = useDialog({
    description: 'This is first dialog',
    title: 'first dialog',
    primaryButton: {
      text: 'Confirm',
    },
    onExitClick: () => closeFirstDialog(),
  })

  const [openSecondDialog, closeSecondDialog] = useDialog({
    description: 'This is second dialog',
    title: 'second dialog',
    primaryButton: {
      text: 'Confirm',
    },
    onExitClick: () => closeSecondDialog(),
  })

  const [openThirdDialog, closeThirdDialog] = useDialog({
    description: 'This is third dialog',
    title: 'third dialog',
    primaryButton: {
      text: 'Confirm',
    },
    onExitClick: () => closeThirdDialog(),
  })
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
    </div>
  )
}
