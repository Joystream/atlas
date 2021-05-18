import { useDialog } from '@/hooks'
import { Button } from '@/shared/components'
import React, { useEffect } from 'react'

const Dialogs = () => {
  const { openDialog } = useDialog()

  useEffect(() => {
    // just to test two dialogs open at once
    openDialog('useEffectDialog', {
      description: 'asdasdasg',
      title: 'First dialog with useEffect',
      primaryButtonText: 'Confirm',
    })
    openDialog('useEffectDialog2', {
      description: 'Second dialog with useEffect',
      title: 'Second dialog',
      primaryButtonText: 'Confirm',
    })
  }, [openDialog])

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
