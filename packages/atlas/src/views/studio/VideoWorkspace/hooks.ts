import { useApolloClient } from '@apollo/client'
import { useCallback } from 'react'

import {
  GetVideosConnectionDocument,
  GetVideosConnectionQuery,
  GetVideosConnectionQueryVariables,
  VideoOrderByInput,
} from '@/api/queries'
import { VideoExtrinsicResult, VideoInputAssets } from '@/joystream-lib'
import { useAssetStore } from '@/providers/assets'
import { useDraftStore } from '@/providers/drafts'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useStartFileUpload } from '@/providers/uploadsManager'
import { useAuthorizedUser } from '@/providers/user'
import { VideoFormData, useVideoWorkspace, useVideoWorkspaceData } from '@/providers/videoWorkspace'
import { writeVideoDataInCache } from '@/utils/cachingAssets'
import { SentryLogger } from '@/utils/logs'

export const useHandleVideoWorkspaceSubmit = () => {
  const { setIsWorkspaceOpen, editedVideoInfo, setEditedVideo } = useVideoWorkspace()

  const { joystream, proxyCallback } = useJoystream()
  const startFileUpload = useStartFileUpload()
  const { activeChannelId, activeMemberId } = useAuthorizedUser()

  const client = useApolloClient()
  const handleTransaction = useTransaction()
  const addAsset = useAssetStore((state) => state.actions.addAsset)
  const removeDrafts = useDraftStore((state) => state.actions.removeDrafts)
  const { tabData } = useVideoWorkspaceData()

  const isEdit = !editedVideoInfo?.isDraft

  const handleSubmit = useCallback(
    async (data: VideoFormData) => {
      if (!joystream) {
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
            replacedDataObjectId: tabData?.assets.video.id || undefined,
          }
        }

        if (data.assets.thumbnailPhoto) {
          const ipfsHash = await data.assets.thumbnailPhoto.hashPromise
          assets.thumbnailPhoto = {
            size: data.assets.thumbnailPhoto.blob.size,
            ipfsHash,
            replacedDataObjectId: tabData?.assets.thumbnail.cropId || undefined,
          }
        }
      }

      const uploadAssets = async ({ videoId, assetsIds }: VideoExtrinsicResult) => {
        const uploadPromises: Promise<unknown>[] = []
        if (data.assets.media && assetsIds.media) {
          const uploadPromise = startFileUpload(data.assets.media.blob, {
            id: assetsIds.media,
            owner: activeChannelId,
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
            owner: activeChannelId,
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

        const fetchedVideo = await client.query<GetVideosConnectionQuery, GetVideosConnectionQueryVariables>({
          query: GetVideosConnectionDocument,
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
              ).createVideo(activeMemberId, activeChannelId, data.metadata, assets, proxyCallback(updateStatus))
            : (
                await joystream.extrinsics
              ).updateVideo(editedVideoInfo.id, activeMemberId, data.metadata, assets, proxyCallback(updateStatus)),
        onTxSync: refetchDataAndUploadAssets,
        successMessage: {
          title: isNew ? 'Video successfully created!' : 'Video successfully updated!',
          description: isNew
            ? 'Your video was created and saved on the blockchain. Upload of video assets may still be in progress.'
            : 'Changes to your video were saved on the blockchain.',
        },
      })

      if (completed) {
        setIsWorkspaceOpen(false)
      }
    },
    [
      activeChannelId,
      activeMemberId,
      addAsset,
      client,
      editedVideoInfo.id,
      handleTransaction,
      isEdit,
      joystream,
      proxyCallback,
      removeDrafts,
      setEditedVideo,
      setIsWorkspaceOpen,
      startFileUpload,
      tabData?.assets.thumbnail.cropId,
      tabData?.assets.video.id,
    ]
  )

  return handleSubmit
}
