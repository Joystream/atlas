import { useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

import { useConfirmationModal } from '@/providers/confirmationModal'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactions'
import { useUploadsStore } from '@/providers/uploadsManager'
import { useAuthorizedUser } from '@/providers/user'
import { removeVideoFromCache } from '@/utils/cachingAssets'

export const useDeleteVideo = () => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { memberId } = useAuthorizedUser()
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
          (await joystream.extrinsics).deleteVideo(videoId, memberId, proxyCallback(updateStatus)),
        onTxSync: async () => {
          removeVideoFromCache(videoId, client)
          removeAssetsWithParentFromUploads('video', videoId)
          onTxSync?.()
        },
      })
    },
    [memberId, client, handleTransaction, joystream, proxyCallback, removeAssetsWithParentFromUploads]
  )

  return useCallback(
    (videoId: string, onDeleteVideo?: () => void) => {
      openDeleteVideoDialog({
        title: 'Delete this video?',
        description:
          'You will not be able to undo this. Deletion requires a blockchain transaction to complete. Currently there is no way to remove uploaded video assets.',
        primaryButton: {
          text: 'Delete video',
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
        type: 'destructive',
      })
    },
    [closeDeleteVideoDialog, confirmDeleteVideo, openDeleteVideoDialog]
  )
}
