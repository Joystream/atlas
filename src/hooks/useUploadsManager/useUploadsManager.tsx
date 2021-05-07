import React, { useCallback, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import * as rax from 'retry-axios'
import { useNavigate } from 'react-router'
import { useSnackbar, useActiveUser } from '@/hooks'
import { useChannel, useVideos } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { ChannelId } from '@/joystream-lib'
import { useUploadsManagerStore } from './store'
import {
  InputAssetUpload,
  AssetUploadWithProgress,
  UploadManagerValue,
  UploadsProgressRecord,
  StartFileUploadOptions,
} from './types'
import { createStorageNodeUrl } from '@/utils/asset'
import { LiaisonJudgement } from '@/api/queries'

const RETRIES_COUNT = 5
const RECONNECTION_ERROR_MESSAGE = 'Reconnection failed'

type GroupByParentObjectIdAcc = {
  [key: string]: AssetUploadWithProgress[]
}

type AssetFile = {
  contentId: string
  blob: File | Blob
}

const UploadManagerContext = React.createContext<UploadManagerValue | undefined>(undefined)
UploadManagerContext.displayName = 'UploadManagerContext'

export const UploadManagerProvider: React.FC = ({ children }) => {
  const navigate = useNavigate()
  const { uploadsState, addAsset, updateAsset } = useUploadsManagerStore()
  const { displaySnackbar } = useSnackbar()
  const [uploadsProgress, setUploadsProgress] = useState<UploadsProgressRecord>({})
  const [assetsFiles, setAssetsFiles] = useState<AssetFile[]>([])
  const { activeUser } = useActiveUser()
  const channelId = activeUser.channelId ?? ''
  const { channel, loading: channelLoading } = useChannel(channelId)
  const { videos, loading: videosLoading } = useVideos(
    {
      where: {
        id_in: uploadsState.filter((item) => item.parentObject.type === 'video').map((item) => item.parentObject.id),
      },
    },
    { skip: !uploadsState.length }
  )

  const uploadsStateWithProgress: AssetUploadWithProgress[] = uploadsState.map((asset) => ({
    ...asset,
    progress: uploadsProgress[asset.contentId] ?? 0,
  }))

  const channelDataObjects = [channel?.avatarPhotoDataObject, channel?.coverPhotoDataObject]
  const videosDataObjects = videos?.flatMap((video) => [video.mediaDataObject, video.thumbnailPhotoDataObject]) || []
  const allDataObjects = [...channelDataObjects, ...videosDataObjects]

  // Enriching data with pending/accepted/rejected status
  const uploadsStateWithLiaisonJudgement = uploadsStateWithProgress.map((asset) => {
    const dataObject = allDataObjects.find((dataObject) => dataObject?.joystreamContentId === asset.contentId)
    if (!dataObject && !channelLoading && !videosLoading) {
      console.warn(`Data object not found. ContentId: ${asset.contentId}`)
    }

    return { ...asset, liaisonJudgement: dataObject?.liaisonJudgement, ipfsContentId: dataObject?.ipfsContentId }
  })

  const lostConnectionAssets = uploadsStateWithLiaisonJudgement.filter(
    (asset) =>
      asset.liaisonJudgement === LiaisonJudgement.Pending &&
      asset.lastStatus === 'inProgress' &&
      asset.progress === 0 &&
      !assetsFiles.find((item) => item.contentId === asset.ipfsContentId)
  )

  useEffect(() => {
    if (!lostConnectionAssets.length) {
      return
    }
    displaySnackbar({
      title: `(${lostConnectionAssets.length}) Asset${
        lostConnectionAssets.length > 1 ? 's' : ''
      } waiting to resume upload`,
      description: 'Reconnect files to fix the issue',
      actionText: 'See assets',
      onActionClick: () => navigate(absoluteRoutes.studio.uploads()),
      iconType: 'warning',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lostConnectionAssets.length, navigate])

  // Enriching video type assets with video title
  const uploadsStateWithVideoTitles = uploadsStateWithLiaisonJudgement.map((asset) => {
    if (asset.type === 'video') {
      const video = videos?.find((video) => video.mediaDataObject?.joystreamContentId === asset.contentId)
      if (!video && !videosLoading) {
        console.warn(`Video not found. ContentId: ${asset.contentId}`)
      }
      return { ...asset, title: video?.title }
    }
    return asset
  })

  // Grouping all assets by parent id (videos, channel)
  const uploadsStateGroupedByParentObjectId = Object.values(
    uploadsStateWithVideoTitles.reduce((acc: GroupByParentObjectIdAcc, asset) => {
      const key = asset.parentObject.id
      !acc[key] ? (acc[key] = [{ ...asset }]) : acc[key].push(asset)
      return acc
    }, {})
  )

  const startFileUpload = useCallback(
    async (
      file: File | Blob | null,
      asset: InputAssetUpload,
      storageMetadata: string,
      opts?: StartFileUploadOptions
    ) => {
      const setAssetUploadProgress = (progress: number) => {
        setUploadsProgress((prevState) => ({ ...prevState, [asset.contentId]: progress }))
      }
      const fileInState = assetsFiles?.find((file) => file.contentId === asset.contentId)
      if (!fileInState && file) {
        setAssetsFiles((prevState) => [...prevState, { contentId: asset.contentId, blob: file }])
      }
      if (!fileInState && !file) {
        throw Error('File was not provided nor found')
      }

      rax.attach()
      try {
        if (!opts?.isReUpload && file) {
          addAsset({ ...asset, lastStatus: 'inProgress', size: file.size })
        }
        setAssetUploadProgress(0)
        const assetUrl = createStorageNodeUrl(asset.contentId, storageMetadata)

        await axios.put(assetUrl.toString(), opts?.changeHost ? fileInState?.blob : file, {
          headers: {
            // workaround for a bug in the storage node
            'Content-Type': '',
          },
          raxConfig: {
            retry: RETRIES_COUNT,
            noResponseRetries: RETRIES_COUNT,
            onRetryAttempt: (err) => {
              const cfg = rax.getConfig(err)
              if (cfg?.currentRetryAttempt === 1) {
                updateAsset(asset.contentId, 'reconnecting')
              }

              if (cfg?.currentRetryAttempt === RETRIES_COUNT) {
                throw Error(RECONNECTION_ERROR_MESSAGE)
              }
            },
          },
          onUploadProgress: ({ loaded, total }: ProgressEvent) => {
            updateAsset(asset.contentId, 'inProgress')
            setAssetUploadProgress((loaded / total) * 100)
          },
        })

        // TODO: remove assets from the same parent if all finished
        updateAsset(asset.contentId, 'completed')
        setAssetUploadProgress(100)
        displaySnackbar({ title: 'Asset uploaded', iconType: 'success' })
      } catch (e) {
        console.error('Upload failed')
        console.error(e)
        if (e.message === RECONNECTION_ERROR_MESSAGE) {
          updateAsset(asset.contentId, 'reconnectionError')
          displaySnackbar({
            title: 'Asset failing to reconnect',
            description: 'Host is not responding',
            actionText: 'Go to uploads',
            onActionClick: () => navigate(absoluteRoutes.studio.uploads()),
            iconType: 'warning',
          })
        } else {
          updateAsset(asset.contentId, 'error')
        }
      }
    },
    [addAsset, assetsFiles, displaySnackbar, navigate, updateAsset]
  )

  const isLoading = channelLoading || videosLoading

  return (
    <UploadManagerContext.Provider
      value={{
        startFileUpload,
        isLoading,
        uploadsState: uploadsStateGroupedByParentObjectId,
      }}
    >
      {children}
    </UploadManagerContext.Provider>
  )
}

const useUploadsManagerContext = () => {
  const ctx = useContext(UploadManagerContext)
  if (ctx === undefined) {
    throw new Error('useUploadsManager must be used within a UploadManagerProvider')
  }
  return ctx
}

export const useUploadsManager = (channelId: ChannelId) => {
  const { uploadsState, ...rest } = useUploadsManagerContext()
  return {
    uploadsState,
    ...rest,
  }
}
