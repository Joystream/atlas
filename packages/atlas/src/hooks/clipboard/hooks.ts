import { useSnackbar } from '@/providers/snackbars'
import { copyToClipboard } from '@/utils/browser'

export const useClipboard = () => {
  const { displaySnackbar } = useSnackbar()
  return {
    copyToClipboard: (text: string, title: string) => {
      copyToClipboard(text)
      displaySnackbar({ title, iconType: 'info' })
    },
  }
}
