import { useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

import { useAppActionMetadataProcessor } from '@/api/hooks/apps'
import { AppActionActionType, VideoOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import {
  GetFullVideosConnectionDocument,
  GetFullVideosConnectionQuery,
  GetFullVideosConnectionQueryVariables,
} from '@/api/queries/__generated__/videos.generated'
import { atlasConfig } from '@/config'
import { VideoExtrinsicResult, VideoInputAssets } from '@/joystream-lib/types'
import { useChannelsStorageBucketsCount } from '@/providers/assets/assets.hooks'
import { useDraftStore } from '@/providers/drafts'
import { useBloatFeesAndPerMbFees, useJoystream } from '@/providers/joystream'
import { usePersonalDataStore } from '@/providers/personalData'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useTransactionManagerStore } from '@/providers/transactions/transactions.store'
import { useStartFileUpload } from '@/providers/uploads/uploads.hooks'
import { useUploadsStore } from '@/providers/uploads/uploads.store'
import { useAuthorizedUser } from '@/providers/user/user.hooks'
import { VideoFormData, VideoWorkspace, useVideoWorkspace, useVideoWorkspaceData } from '@/providers/videoWorkspace'
import { modifyAssetUrlInCache, writeVideoDataInCache } from '@/utils/cachingAssets'
import { createLookup } from '@/utils/data'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

export const useHandleVideoWorkspaceSubmit = () => {
  const { setIsWorkspaceOpen, editedVideoInfo, setEditedVideo } = useVideoWorkspace()
  const isNftMintDismissed = usePersonalDataStore((state) =>
    state.dismissedMessages.some((message) => message.id === 'first-mint')
  )
  const { setShowFistMintDialog } = useTransactionManagerStore((state) => state.actions)
  const { removeAssetFromUploads } = useUploadsStore((state) => state.actions)

  const { joystream, proxyCallback } = useJoystream()
  const startFileUpload = useStartFileUpload()
  const { channelId, memberId } = useAuthorizedUser()

  const client = useApolloClient()
  const handleTransaction = useTransaction()
  const removeDrafts = useDraftStore((state) => state.actions.removeDrafts)
  const { tabData } = useVideoWorkspaceData()
  const channelBucketsCount = useChannelsStorageBucketsCount(channelId)
  const { videoStateBloatBondValue, dataObjectStateBloatBondValue } = useBloatFeesAndPerMbFees()

  const rawMetadataProcessor = useAppActionMetadataProcessor(channelId, AppActionActionType.CreateVideo)

  return useCallback(
    async (data: VideoFormData, videoInfo?: VideoWorkspace, assetsToBeRemoved?: string[]) => {
      if (!joystream) {
        ConsoleLogger.error('No Joystream instance! Has webworker been initialized?')
        return
      }

      if (!channelBucketsCount) {
        SentryLogger.error('Channel buckets count is not set', 'VideoWorkspace.hooks')
        return
      }

      const editedInfo = videoInfo || editedVideoInfo
      const isEdit = !editedInfo?.isDraft
      const isNew = !isEdit

      const assets: VideoInputAssets = {}
      const removedAssetsIds: string[] = []

      const processAssets = async () => {
        if (data.assets.media) {
          const ipfsHash = await data.assets.media.hashPromise
          assets.media = {
            size: data.assets.media.blob.size,
            ipfsHash,
          }
          if (tabData?.assets.video.id) {
            removedAssetsIds.push(tabData.assets.video.id)
          }
        }

        if (data.assets.thumbnailPhoto) {
          const ipfsHash = await data.assets.thumbnailPhoto.hashPromise
          assets.thumbnailPhoto = {
            size: data.assets.thumbnailPhoto.blob.size,
            ipfsHash,
          }
          if (tabData?.assets.thumbnail.cropId) {
            removedAssetsIds.push(tabData.assets.thumbnail.cropId)
          }
        }

        if (data.assets.subtitles?.length) {
          const subtitles = data.assets.subtitles
          assets.subtitles = await Promise.all(
            subtitles.map(async (subtitle) => ({
              id: subtitle.id,
              size: subtitle.blob.size,
              ipfsHash: await subtitle.hashPromise,
            }))
          )
        }
        // if data.metadata.subtitles is not set, that means that subtitles weren't changed
        if (tabData?.subtitlesArray && data.metadata.subtitles) {
          const oldAssetsIds = tabData.subtitlesArray.map((subtitle) => subtitle.id)
          const currentSubtitlesIdsLookup = createLookup(data.metadata.subtitles || [])
          const removedSubtitlesIds = oldAssetsIds.filter(
            (assetId): assetId is string => !!assetId && !currentSubtitlesIdsLookup[assetId]
          )
          removedAssetsIds.push(...removedSubtitlesIds)
        }
      }

      const uploadAssets = async ({ videoId, assetsIds }: VideoExtrinsicResult) => {
        const uploadPromises: Promise<unknown>[] = []
        if (data.assets.media && assetsIds.media) {
          const uploadPromise = startFileUpload(
            data.assets.media.blob,
            {
              id: assetsIds.media,
              owner: channelId,
              parentObject: {
                type: 'video',
                id: videoId,
                title: data.metadata.title,
              },
              type: 'video',
              dimensions: data.assets.media.dimensions,
              ipfsHash: await data.assets.media.hashPromise,
              name: (data.assets.media.blob as File).name,
            },
            { hasNft: !!data.nftMetadata }
          )
          uploadPromises.push(uploadPromise)
        }

        if (data.assets.thumbnailPhoto && assetsIds.thumbnailPhoto) {
          const uploadPromise = startFileUpload(data.assets.thumbnailPhoto.blob, {
            id: assetsIds.thumbnailPhoto,
            owner: channelId,
            parentObject: {
              type: 'video',
              id: videoId,
            },
            type: 'thumbnail',
            dimensions: data.assets.thumbnailPhoto.dimensions,
            imageCropData: data.assets.thumbnailPhoto.cropData,
            ipfsHash: await data.assets.thumbnailPhoto.hashPromise,
            name: data.assets.thumbnailPhoto.name,
          })
          uploadPromises.push(uploadPromise)
        }
        if (data.assets.subtitles?.length && assetsIds.subtitles?.length) {
          const subtitlesIds = assetsIds.subtitles
          const subtitlesUploadPromises = data.assets.subtitles.map(async (subtitle, index) => {
            return startFileUpload(subtitle.blob, {
              id: subtitlesIds[index],
              owner: channelId,
              parentObject: {
                type: 'video',
                id: videoId,
              },
              type: 'subtitles',
              subtitlesLanguageIso: subtitle.subtitlesLanguageIso,
              ipfsHash: await subtitle.hashPromise,
              name: (subtitle.blob as File).name,
            })
          })
          uploadPromises.push(...subtitlesUploadPromises)
        }

        Promise.all(uploadPromises).catch((e) => SentryLogger.error('Unexpected upload failure', 'VideoWorkspace', e))
      }

      const refetchDataAndUploadAssets = async (result: VideoExtrinsicResult) => {
        const { videoId, assetsIds } = result

        // start asset upload
        uploadAssets(result)

        const fetchedVideo = await client.query<GetFullVideosConnectionQuery, GetFullVideosConnectionQueryVariables>({
          query: GetFullVideosConnectionDocument,
          variables: {
            orderBy: VideoOrderByInput.CreatedAtDesc,
            where: {
              id_eq: videoId,
            },
          },
          fetchPolicy: 'network-only',
        })

        if (isNew) {
          if (fetchedVideo.data.videosConnection?.edges[0]) {
            writeVideoDataInCache({
              edge: fetchedVideo.data.videosConnection.edges[0],
              client,
            })
          }

          setEditedVideo({
            id: videoId,
            isDraft: false,
            isNew: false,
          })
          removeDrafts([editedInfo?.id])
        }
        if (data.assets.thumbnailPhoto?.url && assetsIds.thumbnailPhoto) {
          modifyAssetUrlInCache(client, assetsIds.thumbnailPhoto, data.assets.thumbnailPhoto.url)
        }
      }

      const completed = await handleTransaction({
        preProcess: processAssets,
        txFactory: async (updateStatus) =>
          isNew
            ? (
                await joystream.extrinsics
              ).createVideo(
                memberId,
                channelId,
                data.metadata,
                data.nftMetadata,
                assets,
                dataObjectStateBloatBondValue.toString(),
                videoStateBloatBondValue.toString(),
                channelBucketsCount.toString(),
                atlasConfig.general.appId ? proxyCallback(rawMetadataProcessor) : undefined,
                proxyCallback(updateStatus)
              )
            : (
                await joystream.extrinsics
              ).updateVideo(
                editedInfo.id,
                memberId,
                data.metadata,
                data.nftMetadata,
                assets,
                assetsToBeRemoved || removedAssetsIds,
                dataObjectStateBloatBondValue.toString(),
                channelBucketsCount.toString(),
                proxyCallback(updateStatus)
              ),
        onTxSync: refetchDataAndUploadAssets,
        snackbarSuccessMessage: isNew ? undefined : { title: 'Changes published successfully' },
      })

      if (completed) {
        assetsToBeRemoved?.forEach((asset) => {
          removeAssetFromUploads(asset)
        })
        setIsWorkspaceOpen(false)
        if (!isNftMintDismissed && data.nftMetadata) {
          setTimeout(() => {
            setShowFistMintDialog(true)
          }, 2000)
        }
      }
    },
    [
      joystream,
      channelBucketsCount,
      editedVideoInfo,
      handleTransaction,
      tabData?.subtitlesArray,
      tabData?.assets.video.id,
      tabData?.assets.thumbnail.cropId,
      startFileUpload,
      channelId,
      client,
      setEditedVideo,
      removeDrafts,
      memberId,
      dataObjectStateBloatBondValue,
      videoStateBloatBondValue,
      rawMetadataProcessor,
      proxyCallback,
      setIsWorkspaceOpen,
      isNftMintDismissed,
      removeAssetFromUploads,
      setShowFistMintDialog,
    ]
  )
}
