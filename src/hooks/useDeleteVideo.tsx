import { useApolloClient } from '@apollo/client'

import { useAuthorizedUser, useJoystream, useTransactionManager } from '@/providers'
import { removeVideoFromCache } from '@/utils/cachingAssets'

import { useDialog } from '../providers/dialogs'

export const useDeleteVideo = () => {
  const { joystream } = useJoystream()
  const { handleTransaction } = useTransactionManager()
  const { activeMemberId } = useAuthorizedUser()
  const [openDeleteVideoDialog, closeDeleteVideoDialog] = useDialog()

  const client = useApolloClient()

  const deleteVideo = (videoId: string, onDeleteVideo?: () => void) => {
    openDeleteVideoDialog({
      title: 'Delete this video?',
      exitButton: false,
      description:
        'You will not be able to undo this. Deletion requires a blockchain transaction to complete. Currently there is no way to remove uploaded video assets.',
      onPrimaryButtonClick: () => {
        confirmDeleteVideo(videoId, () => onDeleteVideo?.())
        closeDeleteVideoDialog()
      },
      onSecondaryButtonClick: () => {
        closeDeleteVideoDialog()
      },
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
