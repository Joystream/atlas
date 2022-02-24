import { useSnackbar } from '@/providers/snackbars'
import { copyToClipboard } from '@/utils/browser'

export const useClipboard = () => {
  const { displaySnackbar } = useSnackbar()
  return {
    copyToClipboard: (text: string) => {
      copyToClipboard(text)
      displaySnackbar({ title: 'Video URL have been copied', iconType: 'info' })
    },
  }
}
