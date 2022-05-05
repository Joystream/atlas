import { useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

import { useConfirmationModal } from '@/providers/confirmationModal'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useUploadsStore } from '@/providers/uploadsManager'
import { useAuthorizedUser } from '@/providers/user'
import { removeVideoFromCache } from '@/utils/cachingAssets'

export const useDeleteVideo = () => {
  const { joystream, proxyCallback } = useJoystream()
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
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).deleteVideo(videoId, activeMemberId, proxyCallback(updateStatus)),
        onTxSync: async () => {
          removeVideoFromCache(videoId, client)
          removeAssetsWithParentFromUploads('video', videoId)
          onTxSync?.()
        },
      })
    },
    [activeMemberId, client, handleTransaction, joystream, proxyCallback, removeAssetsWithParentFromUploads]
  )

  return useCallback(
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
        type: 'warning',
      })
    },
    [closeDeleteVideoDialog, confirmDeleteVideo, openDeleteVideoDialog]
  )
}
