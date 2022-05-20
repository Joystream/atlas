import { useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

import { GetBasicVideoDocument, GetBasicVideoQuery } from '@/api/queries'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useUploadsStore } from '@/providers/uploadsManager'
import { useAuthorizedUser } from '@/providers/user'
import { removeVideoFromCache } from '@/utils/cachingAssets'
import { SentryLogger } from '@/utils/logs'

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

      const {
        data: { videoByUniqueInput: video },
        error,
      } = await client.query<GetBasicVideoQuery>({ query: GetBasicVideoDocument, fetchPolicy: 'cache-only' })

      if (!video) {
        SentryLogger.error('Failed to get video for delete', 'useDeleteVideo', error)
        return
      }

      const assetsIds = [video.thumbnailPhoto?.id, video.media?.id].filter((x): x is string => !!x)

      handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).deleteVideo(videoId, activeMemberId, assetsIds, proxyCallback(updateStatus)),
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
        iconType: 'warning',
      })
    },
    [closeDeleteVideoDialog, confirmDeleteVideo, openDeleteVideoDialog]
  )
}
