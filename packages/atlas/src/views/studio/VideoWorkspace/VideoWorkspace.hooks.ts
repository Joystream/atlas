import { useApolloClient } from '@apollo/client'
import BN from 'bn.js'
import { useCallback } from 'react'

import {
  GetFullVideosConnectionDocument,
  GetFullVideosConnectionQuery,
  GetFullVideosConnectionQueryVariables,
  VideoOrderByInput,
} from '@/api/queries'
import { useBloatFeesAndPerMbFees } from '@/hooks/useFee'
import { VideoExtrinsicResult, VideoInputAssets } from '@/joystream-lib'
import { useAssetStore } from '@/providers/assets'
import { useDraftStore } from '@/providers/drafts'
import { useJoystream } from '@/providers/joystream'
import { usePersonalDataStore } from '@/providers/personalData'
import { useTransaction, useTransactionManagerStore } from '@/providers/transactions'
import { useStartFileUpload } from '@/providers/uploadsManager'
import { useAuthorizedUser } from '@/providers/user'
import { VideoFormData, useVideoWorkspace, useVideoWorkspaceData } from '@/providers/videoWorkspace'
import { writeVideoDataInCache } from '@/utils/cachingAssets'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

export const useHandleVideoWorkspaceSubmit = () => {
  const { setIsWorkspaceOpen, editedVideoInfo, setEditedVideo } = useVideoWorkspace()
  const isNftMintDismissed = usePersonalDataStore((state) =>
    state.dismissedMessages.some((message) => message.id === 'first-mint')
  )
  const { setShowFistMintDialog } = useTransactionManagerStore((state) => state.actions)

  const { joystream, proxyCallback } = useJoystream()
  const startFileUpload = useStartFileUpload()
  const { channelId, memberId } = useAuthorizedUser()

  const client = useApolloClient()
  const handleTransaction = useTransaction()
  const addAsset = useAssetStore((state) => state.actions.addAsset)
  const removeDrafts = useDraftStore((state) => state.actions.removeDrafts)
  const { tabData } = useVideoWorkspaceData()

  const { videoStateBloatBondValue, dataObjectStateBloatBondValue } = useBloatFeesAndPerMbFees()

  const isEdit = !editedVideoInfo?.isDraft

  const handleSubmit = useCallback(
    async (data: VideoFormData) => {
      if (!joystream) {
        ConsoleLogger.error('No Joystream instance! Has webworker been initialized?')
        return
      }

      const isNew = !isEdit

      const assets: VideoInputAssets = {}
      const processAssets = async () => {
        if (data.assets.media) {
          const ipfsHash = await data.assets.media.hashPromise
          assets.media = {
            size: data.assets.media.blob.size,
            ipfsHash,
            replacedDataObjectId: tabData?.assets.video.id ? new BN(tabData.assets.video.id) : undefined,
          }
        }

        if (data.assets.thumbnailPhoto) {
          const ipfsHash = await data.assets.thumbnailPhoto.hashPromise
          assets.thumbnailPhoto = {
            size: data.assets.thumbnailPhoto.blob.size,
            ipfsHash,
            replacedDataObjectId: tabData?.assets.thumbnail.cropId
              ? new BN(tabData.assets.thumbnail.cropId)
              : undefined,
          }
        }
      }

      const uploadAssets = async ({ videoId, assetsIds }: VideoExtrinsicResult) => {
        const uploadPromises: Promise<unknown>[] = []
        if (data.assets.media && assetsIds.media) {
          const uploadPromise = startFileUpload(data.assets.media.blob, {
            id: assetsIds.media,
            owner: channelId,
            parentObject: {
              type: 'video',
              id: videoId,
              title: data.metadata.title,
            },
            type: 'video',
            dimensions: data.assets.media.dimensions,
          })
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
          })
          uploadPromises.push(uploadPromise)
        }
        Promise.all(uploadPromises).catch((e) => SentryLogger.error('Unexpected upload failure', 'VideoWorkspace', e))
      }

      const refetchDataAndUploadAssets = async (result: VideoExtrinsicResult) => {
        const { assetsIds, videoId } = result

        // start asset upload
        uploadAssets(result)

        // add resolution for newly created asset
        if (assetsIds.thumbnailPhoto) {
          addAsset(assetsIds.thumbnailPhoto, { url: data.assets.thumbnailPhoto?.url })
        }

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
          removeDrafts([editedVideoInfo?.id])
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
                dataObjectStateBloatBondValue,
                videoStateBloatBondValue,
                proxyCallback(updateStatus)
              )
            : (
                await joystream.extrinsics
              ).updateVideo(
                editedVideoInfo.id,
                memberId,
                data.metadata,
                data.nftMetadata,
                assets,
                dataObjectStateBloatBondValue,
                proxyCallback(updateStatus)
              ),
        onTxSync: refetchDataAndUploadAssets,
        snackbarSuccessMessage: isNew ? undefined : { title: 'Changes published successfully' },
      })

      if (completed) {
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
      isEdit,
      handleTransaction,
      tabData?.assets.video.id,
      tabData?.assets.thumbnail.cropId,
      startFileUpload,
      channelId,
      client,
      addAsset,
      setEditedVideo,
      removeDrafts,
      editedVideoInfo.id,
      memberId,
      dataObjectStateBloatBondValue,
      videoStateBloatBondValue,
      proxyCallback,
      setIsWorkspaceOpen,
      isNftMintDismissed,
      setShowFistMintDialog,
    ]
  )

  return handleSubmit
}
