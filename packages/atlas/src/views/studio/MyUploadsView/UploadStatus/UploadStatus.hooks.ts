import { useCallback } from 'react'

import { useFullChannel } from '@/api/hooks/channel'
import { useCreateEditChannelSubmit } from '@/hooks/useChannelFormSubmit'
import { JoystreamLibExtrinsics } from '@/joystream-lib/extrinsics'
import { TxMethodName } from '@/joystream-lib/types'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { AssetUpload } from '@/providers/uploads/uploads.types'
import { useUser } from '@/providers/user/user.hooks'
import { AssetDimensions, ImageCropData } from '@/types/cropper'
import { createId } from '@/utils/createId'
import { computeFileHash } from '@/utils/hashing'
import { SentryLogger } from '@/utils/logs'
import { shortenString } from '@/utils/misc'
import { getVideoMetadata } from '@/utils/video'
import { useHandleVideoWorkspaceSubmit } from '@/views/studio/VideoWorkspace/VideoWorkspace.hooks'

export const FILE_NAME_LENGTH_LIMIT = 24

export type FeeData = {
  methodName: TxMethodName
  args?: Parameters<JoystreamLibExtrinsics[TxMethodName]>
}

export const useUploadStatusModals = () => {
  const [openConfirmationModal, closeConfirmationModal] = useConfirmationModal()

  const openNftConfirmationModal = useCallback(
    (file: File, cb: () => void) => {
      openConfirmationModal({
        title: 'Select the exact same file',
        description: `This file (${
          file.name.length > FILE_NAME_LENGTH_LIMIT ? shortenString(file.name, 16, 8) : file.name
        }) is different from the one you selected before. Since you minted an NFT for this video, in order to continue, you must select the exact same file.`,
        primaryButton: {
          text: 'Select file',
          onClick: () => {
            cb()
            closeConfirmationModal()
          },
        },
        secondaryButton: {
          text: 'Cancel',
          onClick: () => closeConfirmationModal(),
        },
      })
    },
    [closeConfirmationModal, openConfirmationModal]
  )

  type OpenDifferentAssetModal = {
    name: string
    fee: FeeData
    cb: () => Promise<void>
  }

  const openDifferentImageModal = useCallback(
    ({ name, fee, cb }: OpenDifferentAssetModal) => {
      openConfirmationModal({
        fee,
        title: 'Continue with a different file?',
        description: `This file (${
          name.length > FILE_NAME_LENGTH_LIMIT ? shortenString(name, 16, 8) : name
        }) is different from the one you selected before. To upload it, you’ll need to sign a blockchain transaction to confirm editing your video. Are you sure you want to continue?`,
        type: 'warning',
        primaryButton: {
          text: 'Continue',
          onClick: () => {
            closeConfirmationModal()
            cb()
          },
        },
        secondaryButton: {
          text: 'Cancel',
          onClick: () => closeConfirmationModal(),
        },
      })
    },
    [closeConfirmationModal, openConfirmationModal]
  )

  const openDifferentVideoModal = useCallback(
    ({ name, fee, cb }: OpenDifferentAssetModal) => {
      openConfirmationModal({
        fee,
        title: 'Upload different file?',
        description: `This file (${
          name.length > FILE_NAME_LENGTH_LIMIT ? shortenString(name, 16, 8) : name
        }) is different from the one you selected before. To upload it, you’ll need to sign a blockchain transaction to confirm editing your video. Are you sure you want to continue?`,
        type: 'warning',
        primaryButton: {
          text: 'Upload file',
          onClick: () => {
            closeConfirmationModal()
            cb()
          },
        },
        secondaryButton: {
          text: 'Cancel',
          onClick: () => closeConfirmationModal(),
        },
      })
    },
    [closeConfirmationModal, openConfirmationModal]
  )

  const openDifferentBrowserModal = useCallback(
    (cb?: () => void) => {
      openConfirmationModal({
        title: 'You need to sign a blockchain transaction to continue',
        description:
          "It seems you've initially selected this image from a different device, or that you've cleared your browser's history. Because of this, selecting a new image will require signing a blockchain transaction, as a confirmation of your edit. Are you sure you want to continue?",
        primaryButton: {
          text: 'Continue',
          onClick: () => {
            closeConfirmationModal()
            cb?.()
          },
        },
        secondaryButton: {
          text: 'Cancel',
          onClick: () => closeConfirmationModal(),
        },
      })
    },
    [closeConfirmationModal, openConfirmationModal]
  )

  return { openNftConfirmationModal, openDifferentImageModal, openDifferentVideoModal, openDifferentBrowserModal }
}

export const useUploadStatus = (asset: AssetUpload) => {
  const { channelId, accountId } = useUser()

  const handleVideoWorkspaceSubmit = useHandleVideoWorkspaceSubmit()
  const handleEditChannelSubmit = useCreateEditChannelSubmit()

  const { channel, refetch: refetchChannel } = useFullChannel(
    channelId || '',
    {
      skip: !channelId,
      onError: (error) =>
        SentryLogger.error('Failed to fetch channel', 'UploadStatus', error, {
          channel: { id: channelId },
        }),
    },
    { where: { channel: { isPublic_eq: undefined, isCensored_eq: undefined } } }
  )

  const handleAvatarUpdate = useCallback(
    async (
      newAsset: File & { size: number; url?: string },
      croppedBlob: Blob,
      croppedUrl?: string,
      dimensions?: AssetDimensions,
      cropData?: ImageCropData,
      originalBlob?: File | Blob | null
    ) => {
      const emptyAsset = {
        assetDimensions: null,
        contentId: null,
        imageCropData: null,
        originalBlob: undefined,
      }
      const isChannelUpload = asset.parentObject.type === 'channel'
      if (isChannelUpload) {
        const assetDimensions = dimensions !== undefined ? dimensions : null
        const imageCropData = cropData !== undefined ? cropData : null
        await handleEditChannelSubmit({
          metadata: { ownerAccount: accountId ?? '' },
          channel,
          newChannel: false,
          assets:
            asset.type === 'avatar'
              ? {
                  avatarPhoto: {
                    ...newAsset,
                    contentId: `local-avatar-${createId()}`,
                    originalBlob,
                    croppedUrl,
                    croppedBlob,
                    imageCropData,
                    assetDimensions,
                  },
                  coverPhoto: emptyAsset,
                }
              : {
                  coverPhoto: {
                    ...newAsset,
                    contentId: `local-cover-${createId()}`,
                    originalBlob,
                    croppedUrl,
                    croppedBlob,
                    imageCropData,
                    assetDimensions,
                  },
                  avatarPhoto: emptyAsset,
                },
          refetchChannel,
        })
      } else {
        const newCropAssetId = `local-thumbnail-crop-${createId()}`
        const newOriginalAssetId = `local-thumbnail-original-${createId()}`
        const videoInfo = {
          id: asset.parentObject.id,
          isNew: false,
          isDraft: false,
        }
        await handleVideoWorkspaceSubmit(
          {
            assets: {
              thumbnailPhoto: {
                blob: croppedBlob,
                id: newCropAssetId,
                originalId: newOriginalAssetId,
                hashPromise: computeFileHash(croppedBlob),
                cropData,
                dimensions,
              },
            },
            metadata: { clearSubtitles: true },
            nftMetadata: undefined,
          },
          videoInfo,
          [asset.id]
        )
      }
    },
    [accountId, asset, channel, handleEditChannelSubmit, handleVideoWorkspaceSubmit, refetchChannel]
  )

  const handleVideoUpdate = useCallback(
    async (file: File, newAssetId: string) => {
      const videoInfo = {
        id: asset.parentObject.id,
        isNew: false,
        isDraft: false,
      }
      const { mimeType, duration, width, height } = await getVideoMetadata(file)
      await handleVideoWorkspaceSubmit(
        {
          assets: {
            media: {
              ...file,
              hashPromise: computeFileHash(file),
              id: newAssetId,
              blob: file,
              dimensions: asset.dimensions,
            },
          },
          metadata: {
            clearSubtitles: true,
            duration: Math.round(duration),
            mimeMediaType: mimeType,
            mediaPixelWidth: width,
            mediaPixelHeight: height,
          },
          nftMetadata: undefined,
        },
        videoInfo,
        [asset.id]
      )
    },
    [asset, handleVideoWorkspaceSubmit]
  )
  return { handleAvatarUpdate, handleVideoUpdate }
}
