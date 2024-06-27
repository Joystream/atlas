import { useApolloClient } from '@apollo/client'
import BN from 'bn.js'
import { useCallback } from 'react'

import { useAppActionMetadataProcessor } from '@/api/hooks/apps'
import { AppActionActionType } from '@/api/queries/__generated__/baseTypes.generated'
import { GetExtendedFullChannelsQueryHookResult } from '@/api/queries/__generated__/channels.generated'
import { FullChannelFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { atlasConfig } from '@/config'
import {
  ChannelAssets,
  ChannelAssetsIds,
  ChannelExtrinsicResult,
  ChannelInputAssets,
  ChannelInputMetadata,
} from '@/joystream-lib/types'
import { useChannelsStorageBucketsCount } from '@/providers/assets/assets.hooks'
import { useOperatorsContext } from '@/providers/assets/assets.provider'
import { useBloatFeesAndPerMbFees, useBucketsConfigForNewChannel, useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useStartFileUpload } from '@/providers/uploads/uploads.hooks'
import { useUploadsStore } from '@/providers/uploads/uploads.store'
import { useUser } from '@/providers/user/user.hooks'
import { AssetDimensions, ImageCropData } from '@/types/cropper'
import { modifyAssetUrlInCache } from '@/utils/cachingAssets'
import { createId } from '@/utils/createId'
import { computeFileHash } from '@/utils/hashing'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

type ImageAsset = {
  contentId: string | null
  croppedBlob?: File | Blob | null
  croppedUrl?: string | null
  assetDimensions: AssetDimensions | null
  imageCropData: ImageCropData | null
  originalBlob?: File | Blob | null
  originalUrl?: string | null
}

export type CreateEditChannelFormInputs = {
  title?: string
  description?: string
  isPublic: boolean
  language: string
  avatar: ImageAsset
  cover: ImageAsset
}

type CreateEditChannelData = {
  newChannel: boolean
  metadata: ChannelInputMetadata
  assets: ChannelAssets<ImageAsset>
  channel?: FullChannelFieldsFragment
  refetchChannel?: GetExtendedFullChannelsQueryHookResult['refetch']
  fee?: BN
  collaboratorId?: string
}

type CreateEditChannelSubmitParams = {
  data: CreateEditChannelData
  onUploadAssets?: (field: 'avatar.contentId' | 'cover.contentId', data: string) => void
  onCompleted?: () => void
  onError?: () => void
  onTxSync?: (result: { block: number } & { channelId: string; assetsIds: ChannelAssetsIds }) => void | Promise<void>
  minimized?:
    | {
        errorMessage: string
      }
    | undefined
}

export const useCreateEditChannelSubmit = (initialChannelId?: string) => {
  const { joystream, proxyCallback } = useJoystream()
  const { channelId: activeChannelId, memberId, refetchUserMemberships } = useUser()
  const channelId = initialChannelId || activeChannelId
  const addNewChannelIdToUploadsStore = useUploadsStore((state) => state.actions.addNewChannelId)
  const getBucketsConfigForNewChannel = useBucketsConfigForNewChannel()
  const { channelStateBloatBondValue, dataObjectStateBloatBondValue } = useBloatFeesAndPerMbFees()
  const channelBucketsCount = useChannelsStorageBucketsCount(channelId)
  const startFileUpload = useStartFileUpload()
  const handleTransaction = useTransaction()
  const { fetchStorageOperators } = useOperatorsContext()
  const client = useApolloClient()

  const rawMetadataProcessor = useAppActionMetadataProcessor(
    (memberId && memberId.toString()) || '',
    AppActionActionType.CreateChannel
  )

  return useCallback(
    async ({ data, onCompleted, onUploadAssets, minimized, onTxSync, onError }: CreateEditChannelSubmitParams) => {
      if (!joystream) {
        ConsoleLogger.error('No Joystream instance! Has webworker been initialized?')
        return
      }

      const assets: ChannelInputAssets = {}
      let removedAssetsIds: string[] = []

      const createChannelAssets = (
        avatarHash?: string | null,
        coverPhotoHash?: string | null
      ): [ChannelInputAssets, string[]] => {
        const replacedAssetsIds = []
        const newAssets: ChannelInputAssets = {}
        if (data.assets.avatarPhoto?.croppedBlob?.size) {
          newAssets.avatarPhoto = {
            size: data.assets.avatarPhoto?.croppedBlob.size,
            ipfsHash: avatarHash || '',
          }
        }
        if (data.channel?.avatarPhoto?.id && avatarHash) {
          replacedAssetsIds.push(data.channel.avatarPhoto.id)
        }
        if (data.assets.coverPhoto?.croppedBlob?.size) {
          newAssets.coverPhoto = {
            size: data.assets.coverPhoto.croppedBlob.size,
            ipfsHash: coverPhotoHash || '',
          }
        }
        if (data.channel?.coverPhoto?.id && coverPhotoHash) {
          replacedAssetsIds.push(data.channel.coverPhoto.id)
        }
        return [newAssets, replacedAssetsIds]
      }

      const processAssets = async () => {
        const avatarIpfsHash =
          data.assets.avatarPhoto?.croppedBlob &&
          data.assets.avatarPhoto &&
          (await computeFileHash(data.assets.avatarPhoto.croppedBlob))
        const coverIpfsHash =
          data.assets.coverPhoto?.croppedBlob &&
          data.assets.coverPhoto &&
          (await computeFileHash(data.assets.coverPhoto.croppedBlob))

        const [createdAssets, assetIdsToRemove] = createChannelAssets(avatarIpfsHash, coverIpfsHash)
        if (createdAssets.avatarPhoto) {
          assets.avatarPhoto = createdAssets.avatarPhoto
        }
        if (createdAssets.coverPhoto) {
          assets.coverPhoto = createdAssets.coverPhoto
        }
        removedAssetsIds = assetIdsToRemove
      }

      const uploadAssets = async ({ channelId, assetsIds }: ChannelExtrinsicResult) => {
        const uploadPromises: Promise<unknown>[] = []
        if (data.assets.avatarPhoto?.croppedBlob && assetsIds.avatarPhoto) {
          const uploadPromise = startFileUpload(data.assets.avatarPhoto.croppedBlob, {
            id: assetsIds.avatarPhoto,
            owner: channelId,
            parentObject: {
              type: 'channel',
              id: channelId,
            },
            dimensions: data.assets.avatarPhoto?.assetDimensions ?? undefined,
            imageCropData: data.assets.avatarPhoto?.imageCropData ?? undefined,
            type: 'avatar',
            name: (data.assets.avatarPhoto?.originalBlob as File)?.name ?? `${channelId}-avatar-${createId()}`,
          })
          uploadPromises.push(uploadPromise)
        }
        if (data.assets.coverPhoto?.croppedBlob && assetsIds.coverPhoto) {
          const uploadPromise = startFileUpload(data.assets.coverPhoto.croppedBlob, {
            id: assetsIds.coverPhoto,
            owner: channelId,
            parentObject: {
              type: 'channel',
              id: channelId,
            },
            dimensions: data.assets.coverPhoto?.assetDimensions ?? undefined,
            imageCropData: data.assets.coverPhoto?.imageCropData ?? undefined,
            type: 'cover',
            name: (data.assets.coverPhoto?.originalBlob as File)?.name ?? `${channelId}-cover-${createId()}`,
          })
          uploadPromises.push(uploadPromise)
        }
        Promise.all(uploadPromises).catch((e) =>
          SentryLogger.error('Unexpected upload failure', 'CreateEditChannelView', e)
        )
      }

      const refetchDataAndUploadAssets = async (result: ChannelExtrinsicResult) => {
        const { channelId, assetsIds } = result
        if (assetsIds.avatarPhoto && data.assets.avatarPhoto?.croppedUrl) {
          onUploadAssets?.('avatar.contentId', assetsIds.avatarPhoto)
        }
        if (assetsIds.coverPhoto && data.assets.coverPhoto?.croppedUrl) {
          onUploadAssets?.('cover.contentId', assetsIds.coverPhoto)
        }

        if (data.newChannel) {
          // add channel to new channels list before refetching membership to make sure UploadsManager doesn't complain about missing assets
          addNewChannelIdToUploadsStore(channelId)
          // membership includes full list of channels so the channel update will be fetched too
          await refetchUserMemberships()
        } else {
          await data?.refetchChannel?.()
        }

        if (data.newChannel) {
          // when creating a channel, refetch operators before uploading so that storage bag assignments gets populated for a new channel
          await fetchStorageOperators()
          uploadAssets(result)
        } else {
          uploadAssets(result)
        }

        if (assetsIds.avatarPhoto && data.assets.avatarPhoto?.croppedUrl) {
          modifyAssetUrlInCache(client, assetsIds.avatarPhoto, data.assets.avatarPhoto.croppedUrl)
        }
        if (assetsIds.coverPhoto && data.assets.coverPhoto?.croppedUrl) {
          modifyAssetUrlInCache(client, assetsIds.coverPhoto, data.assets.coverPhoto.croppedUrl)
        }
      }
      const completed = await handleTransaction({
        minimized,
        fee: data.fee,
        preProcess: processAssets,
        txFactory: async (updateStatus) =>
          data.newChannel
            ? (
                await joystream.extrinsics
              ).createChannel(
                memberId ?? '',
                data.metadata,
                assets,
                await getBucketsConfigForNewChannel(),
                dataObjectStateBloatBondValue.toString(),
                channelStateBloatBondValue.toString(),
                atlasConfig.general.appId ? proxyCallback(rawMetadataProcessor) : undefined,
                data.collaboratorId,
                proxyCallback(updateStatus)
              )
            : (
                await joystream.extrinsics
              ).updateChannel(
                channelId ?? '',
                memberId ?? '',
                data.metadata,
                assets,
                removedAssetsIds,
                dataObjectStateBloatBondValue.toString(),
                channelBucketsCount.toString(),
                data.collaboratorId,
                proxyCallback(updateStatus)
              ),
        onError: onError,
        onTxSync: async (result) => {
          onTxSync?.(result)
          return refetchDataAndUploadAssets(result)
        },
      })

      if (completed) {
        await onCompleted?.()
      }
    },
    [
      addNewChannelIdToUploadsStore,
      channelBucketsCount,
      channelId,
      channelStateBloatBondValue,
      client,
      dataObjectStateBloatBondValue,
      fetchStorageOperators,
      getBucketsConfigForNewChannel,
      handleTransaction,
      joystream,
      memberId,
      proxyCallback,
      rawMetadataProcessor,
      refetchUserMemberships,
      startFileUpload,
    ]
  )
}
