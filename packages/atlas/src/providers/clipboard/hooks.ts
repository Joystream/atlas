import { SnackbarIconType, useSnackbar } from '@/providers/snackbars'
import { copyToClipboard } from '@/utils/browser'

export const useClipboard = () => {
  const { displaySnackbar } = useSnackbar()
  return {
    copyToClipboard: (text: string, title = 'Video URL copied to clipboard', iconType: SnackbarIconType = 'info') => {
      copyToClipboard(text)
      displaySnackbar({ title, iconType })
    },
  }
}
