import { useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

import { useConfirmationModal } from '@/providers/confirmationModal'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useUploadsStore } from '@/providers/uploadsManager'
import { useAuthorizedUser } from '@/providers/user'
import { removeVideoFromCache } from '@/utils/cachingAssets'

export const useDeleteVideo = () => {
  const { joystream } = useJoystream()
  const handleTransaction = useTransaction()
  const { activeMemberId } = useAuthorizedUser()
  const removeAssetsWithParentFromUploads = useUploadsStore((state) => state.actions.removeAssetsWithParentFromUploads)
  const [openDeleteVideoDialog, closeDeleteVideoDialog] = useConfirmationModal()

  const client = useApolloClient()

  const confirmDeleteVideo = useCallback(
    async (videoId: string, onTxSync?: () => void) => {
      if (!joystream) {
        return
      }

      handleTransaction({
        txFactory: (updateStatus) => joystream.deleteVideo(videoId, activeMemberId, updateStatus),
        onTxSync: async () => {
          removeVideoFromCache(videoId, client)
          removeAssetsWithParentFromUploads('video', videoId)
          onTxSync?.()
        },
        successMessage: {
          title: 'Video successfully deleted!',
          description: 'Your video was marked as deleted and it will no longer show up on Joystream.',
        },
      })
    },
    [activeMemberId, client, handleTransaction, joystream, removeAssetsWithParentFromUploads]
  )

  const deleteVideo = useCallback(
    (videoId: string, onDeleteVideo?: () => void) => {
      openDeleteVideoDialog({
        title: 'Delete this video?',
        description:
          'You will not be able to undo this. Deletion requires a blockchain transaction to complete. Currently there is no way to remove uploaded video assets.',
        primaryButton: {
          text: 'Delete video',
          variant: 'destructive',
          onClick: () => {
            confirmDeleteVideo(videoId, () => onDeleteVideo?.())
            closeDeleteVideoDialog()
          },
        },
        secondaryButton: {
          text: 'Cancel',
          onClick: () => {
            closeDeleteVideoDialog()
          },
        },
        iconType: 'warning',
      })
    },
    [closeDeleteVideoDialog, confirmDeleteVideo, openDeleteVideoDialog]
  )

  return deleteVideo
}
