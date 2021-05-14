import { useDialog } from '@/hooks'
import { Button } from '@/shared/components'
import React from 'react'

const Dialogs = () => {
  const { openDialog } = useDialog()

  return (
    <>
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
    </>
  )
}

export default Dialogs
