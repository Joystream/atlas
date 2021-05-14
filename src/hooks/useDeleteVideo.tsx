import { useJoystream, useAuthorizedUser, useTransactionManager } from '@/hooks'
import { useApolloClient } from '@apollo/client'
import { removeVideoFromCache } from '@/utils/cachingAssets'
import { useDialog } from './useDialog'

const DELETE_DIALOG = 'DELETE_DIALOG'

export const useDeleteVideo = () => {
  const { joystream } = useJoystream()
  const { handleTransaction } = useTransactionManager()
  const { activeMemberId } = useAuthorizedUser()
  const { closeDialog, openDialog } = useDialog()

  const client = useApolloClient()

  const deleteVideo = (videoId: string, onDeleteVideo?: () => void) => {
    openDialog(DELETE_DIALOG, {
      title: 'Delete this video?',
      exitButton: false,
      description:
        'You will not be able to undo this. Deletion requires a blockchain transaction to complete. Currently there is no way to remove uploaded video assets.',
      onSecondaryButtonClick: () => closeDialog(DELETE_DIALOG),
      onPrimaryButtonClick: () => confirmDeleteVideo(videoId, () => onDeleteVideo?.()),
      error: true,
      variant: 'warning',
      primaryButtonText: 'Delete video',
      secondaryButtonText: 'Cancel',
    })
  }

  const confirmDeleteVideo = async (videoId: string, onTxSync?: () => void) => {
    if (!joystream) {
      return
    }
    closeDialog(DELETE_DIALOG)

    handleTransaction({
      txFactory: (updateStatus) => joystream.deleteVideo(videoId, activeMemberId, updateStatus),
      onTxSync: async () => {
        removeVideoFromCache(videoId, client)
        onTxSync?.()
      },
      successMessage: {
        title: 'Video successfully deleted!',
        description: 'Your video was marked as deleted and it will no longer show up on Joystream.',
      },
    })
  }

  return deleteVideo
}
