import React from 'react'

import { Button } from '@/components/_inputs/Button'
import { useConfirmationModal } from '@/providers/confirmationModal'

export const Modals = () => {
  const [openFirstDialog, closeFirstDialog] = useConfirmationModal({
    description: 'This is first dialog',
    title: 'first dialog',
    primaryButton: {
      text: 'Confirm',
    },
    onExitClick: () => closeFirstDialog(),
  })

  const [openSecondDialog, closeSecondDialog] = useConfirmationModal({
    description: 'This is second dialog',
    title: 'second dialog',
    primaryButton: {
      text: 'Confirm',
    },
    onExitClick: () => closeSecondDialog(),
  })

  const [openThirdDialog, closeThirdDialog] = useConfirmationModal({
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
