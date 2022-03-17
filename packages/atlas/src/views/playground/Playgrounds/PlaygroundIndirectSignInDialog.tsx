import React from 'react'

import { Button } from '@/components/_buttons/Button'
import { useDisplaySignInDialog } from '@/hooks/useDisplaySignInDialog'

export const PlaygroundIndirectSignInDialog = () => {
  const { openSignInDialog } = useDisplaySignInDialog()
  return (
    <Button variant="primary" onClick={() => openSignInDialog({})}>
      Open sign in dialog
    </Button>
  )
}
