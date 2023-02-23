import BN from 'bn.js'
import { useCallback } from 'react'

import { useAppActionMetadataProcessor } from '@/api/hooks/apps'
import { FullChannelFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { useGetChannelCountQuery } from '@/api/queries/__generated__/memberships.generated'
import { atlasConfig } from '@/config'
import { ChannelAssets, ChannelExtrinsicResult, ChannelInputAssets, ChannelInputMetadata } from '@/joystream-lib/types'
import { useChannelsStorageBucketsCount } from '@/providers/assets/assets.hooks'
import { useOperatorsContext } from '@/providers/assets/assets.provider'
import { ResolvedAsset, useAssetStore } from '@/providers/assets/assets.store'
import {
  useBloatFeesAndPerMbFees,
  useBucketsConfigForNewChannel,
  useJoystream,
} from '@/providers/joystream/joystream.hooks'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useStartFileUpload } from '@/providers/uploads/uploads.hooks'
import { useUploadsStore } from '@/providers/uploads/uploads.store'
import { useUser } from '@/providers/user/user.hooks'
import { AssetDimensions, ImageCropData } from '@/types/cropper'
import { computeFileHash } from '@/utils/hashing'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

type ImageAsset = {
  contentId: string | null
  assetDimensions: AssetDimensions | null
  imageCropData: ImageCropData | null
  originalBlob?: File | Blob | null
}

export type Inputs = {
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
  avatarAsset: ResolvedAsset | null
  coverAsset: ResolvedAsset | null
  channel?: FullChannelFieldsFragment
  refetchChannel: () => void
  fee?: BN
}

export const useCreateEditChannelSubmit = () => {
  const { joystream, proxyCallback } = useJoystream()
  const { channelId, memberId, setActiveUser, refetchUserMemberships } = useUser()
  const addNewChannelIdToUploadsStore = useUploadsStore((state) => state.actions.addNewChannelId)
  const getBucketsConfigForNewChannel = useBucketsConfigForNewChannel()
  const { channelStateBloatBondValue, dataObjectStateBloatBondValue } = useBloatFeesAndPerMbFees()
  const channelBucketsCount = useChannelsStorageBucketsCount(channelId)
  const startFileUpload = useStartFileUpload()
  const handleTransaction = useTransaction()
  const { fetchOperators } = useOperatorsContext()
  const { data: channelCountData } = useGetChannelCountQuery({
    variables: { where: { ownerMember: { id_eq: memberId } } },
    skip: !channelId,
  })

  const addAsset = useAssetStore((state) => state.actions.addAsset)

  const rawMetadataProcessor = useAppActionMetadataProcessor(
    `m:${memberId}`,
    channelCountData?.channelsConnection.totalCount
  )

  return useCallback(
    async (
      data: CreateEditChannelData,
      onTxSync?: () => void,
      onUploadAssets?: (field: 'avatar.contentId' | 'cover.contentId', data: string) => void,
      onCompleted?: () => void
    ) => {
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
        if (data.avatarAsset?.blob?.size) {
          newAssets.avatarPhoto = {
            size: data.avatarAsset?.blob.size,
            ipfsHash: avatarHash || '',
          }
        }
        if (data.channel?.avatarPhoto?.id && avatarHash) {
          replacedAssetsIds.push(data.channel.avatarPhoto.id)
        }
        if (data.coverAsset?.blob?.size) {
          newAssets.coverPhoto = {
            size: data.coverAsset.blob.size,
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
          data.avatarAsset?.blob && data.assets.avatarPhoto && (await computeFileHash(data.avatarAsset.blob))
        const coverIpfsHash =
          data.coverAsset?.blob && data.assets.coverPhoto && (await computeFileHash(data.coverAsset.blob))

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
        if (data.avatarAsset?.blob && assetsIds.avatarPhoto) {
          const uploadPromise = startFileUpload(data.avatarAsset.blob, {
            id: assetsIds.avatarPhoto,
            owner: channelId,
            parentObject: {
              type: 'channel',
              id: channelId,
            },
            dimensions: data.assets.avatarPhoto?.assetDimensions ?? undefined,
            imageCropData: data.assets.avatarPhoto?.imageCropData ?? undefined,
            type: 'avatar',
            name: (data.assets.avatarPhoto?.originalBlob as File).name,
          })
          uploadPromises.push(uploadPromise)
        }
        if (data.coverAsset?.blob && assetsIds.coverPhoto) {
          const uploadPromise = startFileUpload(data.coverAsset.blob, {
            id: assetsIds.coverPhoto,
            owner: channelId,
            parentObject: {
              type: 'channel',
              id: channelId,
            },
            dimensions: data.assets.coverPhoto?.assetDimensions ?? undefined,
            imageCropData: data.assets.coverPhoto?.imageCropData ?? undefined,
            type: 'cover',
            name: (data.assets.coverPhoto?.originalBlob as File).name,
          })
          uploadPromises.push(uploadPromise)
        }
        Promise.all(uploadPromises).catch((e) =>
          SentryLogger.error('Unexpected upload failure', 'CreateEditChannelView', e)
        )
      }

      const refetchDataAndUploadAssets = async (result: ChannelExtrinsicResult) => {
        const { channelId, assetsIds } = result
        if (assetsIds.avatarPhoto && data.avatarAsset?.url) {
          addAsset(assetsIds.avatarPhoto, { url: data.avatarAsset.url })
          onUploadAssets?.('avatar.contentId', assetsIds.avatarPhoto)
        }
        if (assetsIds.coverPhoto && data.coverAsset?.url) {
          addAsset(assetsIds.coverPhoto, { url: data.coverAsset.url })
          onUploadAssets?.('cover.contentId', assetsIds.coverPhoto)
        }

        if (data.newChannel) {
          // add channel to new channels list before refetching membership to make sure UploadsManager doesn't complain about missing assets
          addNewChannelIdToUploadsStore(channelId)
          // membership includes full list of channels so the channel update will be fetched too
          await refetchUserMemberships()
        } else {
          await data?.refetchChannel()
        }

        if (data.newChannel) {
          // when creating a channel, refetch operators before uploading so that storage bag assignments gets populated for a new channel
          setActiveUser({ channelId })
          fetchOperators().then(() => {
            uploadAssets(result)
          })
        } else {
          uploadAssets(result)
        }
      }

      const completed = await handleTransaction({
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
                atlasConfig.general.appId ? rawMetadataProcessor : undefined,
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
                undefined,
                proxyCallback(updateStatus)
              ),
        onTxSync: (result) => {
          onTxSync?.()
          return refetchDataAndUploadAssets(result)
        },
      })

      if (completed && data.newChannel) {
        onCompleted?.()
      }
    },
    [
      addAsset,
      addNewChannelIdToUploadsStore,
      channelBucketsCount,
      channelId,
      channelStateBloatBondValue,
      dataObjectStateBloatBondValue,
      fetchOperators,
      getBucketsConfigForNewChannel,
      handleTransaction,
      joystream,
      memberId,
      proxyCallback,
      rawMetadataProcessor,
      refetchUserMemberships,
      setActiveUser,
      startFileUpload,
    ]
  )
}
