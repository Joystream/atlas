import { useCallback } from 'react'

import { useSnackbar } from '@/providers/snackbars'

export const useClipboard = () => {
  const { displaySnackbar } = useSnackbar()

  const copyToClipboard = useCallback(
    (value: string, message?: string) => {
      navigator.clipboard.writeText(value)
      if (message) {
        displaySnackbar({ title: message, iconType: 'info', timeout: 3000 })
      }
    },
    [displaySnackbar]
  )

  return { copyToClipboard }
}
