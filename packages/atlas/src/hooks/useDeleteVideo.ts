import { useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

import {
  GetFullVideoDocument,
  GetFullVideoQuery,
  GetFullVideoQueryVariables,
} from '@/api/queries/__generated__/videos.generated'
import { useStorageOperators } from '@/providers/assets/assets.provider'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUploadsStore } from '@/providers/uploads/uploads.store'
import { useAuthorizedUser } from '@/providers/user/user.hooks'
import { createChannelBagId } from '@/utils/asset'
import { removeVideoFromCache } from '@/utils/cachingAssets'
import { ConsoleLogger } from '@/utils/logs'

export const useDeleteVideo = () => {
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const { memberId } = useAuthorizedUser()
  const removeAssetsWithParentFromUploads = useUploadsStore((state) => state.actions.removeAssetsWithParentFromUploads)
  const [openDeleteVideoDialog, closeDeleteVideoDialog] = useConfirmationModal()

  const client = useApolloClient()
  const { getAllStorageOperatorsForBag } = useStorageOperators()

  const confirmDeleteVideo = useCallback(
    async (videoId: string, onTxSync?: () => void) => {
      if (!joystream) {
        return
      }

      const {
        data: { videoById: video },
      } = await client.query<GetFullVideoQuery, GetFullVideoQueryVariables>({
        query: GetFullVideoDocument,
        variables: { id: videoId },
      })
      if (!video) {
        ConsoleLogger.error('No video found when deleting', { videoId })
        return
      }
      const channelBagId = createChannelBagId(video.channel.id)
      const channelStorageBuckets = await getAllStorageOperatorsForBag(channelBagId, true)
      const channelStorageBucketsCount = channelStorageBuckets?.length ?? 0

      let dataObjectsCount = 0
      if (video.media) dataObjectsCount++
      if (video.thumbnailPhoto) dataObjectsCount++
      if (video.subtitles?.length) {
        const subtitlesWithAsset = video.subtitles.filter((subtitle) => subtitle.asset)
        dataObjectsCount += subtitlesWithAsset.length
      }

      handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).deleteVideo(
            videoId,
            memberId,
            dataObjectsCount,
            channelStorageBucketsCount.toString(),
            proxyCallback(updateStatus)
          ),
        onTxSync: async () => {
          removeVideoFromCache(video.id, client)
          removeAssetsWithParentFromUploads('video', videoId)
          onTxSync?.()
        },
      })
    },
    [
      joystream,
      client,
      getAllStorageOperatorsForBag,
      handleTransaction,
      memberId,
      proxyCallback,
      removeAssetsWithParentFromUploads,
    ]
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
        fee: {
          methodName: 'deleteVideoTx',
          args: [videoId, memberId],
        },
      })
    },
    [closeDeleteVideoDialog, confirmDeleteVideo, memberId, openDeleteVideoDialog]
  )
}
