import axios from 'axios'
import { throttle, debounce } from 'lodash'
import React, { useCallback, useContext, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import * as rax from 'retry-axios'

import { useChannel, useVideos } from '@/api/hooks'
import { LiaisonJudgement } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { useSnackbar, useUser, useStorageProviders } from '@/hooks'
import { ChannelId } from '@/joystream-lib'
import { createStorageNodeUrl } from '@/utils/asset'

import { useUploadsManagerStore } from './store'
import {
  InputAssetUpload,
  AssetUploadWithProgress,
  UploadManagerValue,
  UploadsProgressRecord,
  StartFileUploadOptions,
} from './types'

const RETRIES_COUNT = 3
const UPLOADING_SNACKBAR_TIMEOUT = 8000
const UPLOADED_SNACKBAR_TIMEOUT = 13000

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
  const { getStorageProvider, markStorageProviderNotWorking } = useStorageProviders()
  const { displaySnackbar } = useSnackbar()
  const [uploadsProgress, setUploadsProgress] = useState<UploadsProgressRecord>({})
  const [assetsFiles, setAssetsFiles] = useState<AssetFile[]>([])
  const { activeChannelId } = useUser()
  const { channel, loading: channelLoading } = useChannel(activeChannelId ?? '')
  const { videos, loading: videosLoading } = useVideos(
    {
      where: {
        id_in: uploadsState.filter((item) => item.parentObject.type === 'video').map((item) => item.parentObject.id),
      },
    },
    { skip: !uploadsState.length }
  )
  const pendingNotificationsCounts = useRef({ uploading: 0, uploaded: 0 })

  const uploadsStateWithProgress: AssetUploadWithProgress[] = uploadsState.map((asset) => ({
    ...asset,
    progress: uploadsProgress[asset.contentId] ?? 0,
  }))

  const channelDataObjects = [channel?.avatarPhotoDataObject, channel?.coverPhotoDataObject]
  const videosDataObjects = videos?.flatMap((video) => [video.mediaDataObject, video.thumbnailPhotoDataObject]) || []
  const allDataObjects = [...channelDataObjects, ...videosDataObjects]

  // Enriching data with pending/accepted/rejected status
  const uploadsStateWithLiaisonJudgement = uploadsStateWithProgress
    .map((asset) => {
      const dataObject = allDataObjects.find((dataObject) => dataObject?.joystreamContentId === asset.contentId)
      if (!dataObject && !channelLoading && !videosLoading) {
        return null
      }

      return { ...asset, liaisonJudgement: dataObject?.liaisonJudgement, ipfsContentId: dataObject?.ipfsContentId }
    })
    .filter((asset) => asset !== null)

  const lostConnectionAssets = uploadsStateWithLiaisonJudgement.filter(
    (asset) => asset?.liaisonJudgement === LiaisonJudgement.Pending && asset.lastStatus === 'error'
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
      actionText: 'See',
      onActionClick: () => navigate(absoluteRoutes.studio.uploads()),
      iconType: 'warning',
    })
  }, [displaySnackbar, lostConnectionAssets.length, navigate])

  // Enriching video type assets with video title
  const uploadsStateWithVideoTitles = uploadsStateWithLiaisonJudgement.map((asset) => {
    if (asset?.type === 'video') {
      const video = videos?.find((video) => video.mediaDataObject?.joystreamContentId === asset.contentId)
      const title = video?.title ?? null
      return { ...asset, title }
    }
    return asset
  })

  // Check if liaison data and video title is available
  uploadsStateWithVideoTitles.map((asset) => {
    if (!channelLoading && !videosLoading && (!asset?.liaisonJudgement || !asset?.ipfsContentId)) {
      console.warn(`Asset does not contain liaisonJudgement. ContentId: ${asset?.contentId}`)
    }
    if (!channelLoading && !videosLoading && asset?.type === 'video' && !asset?.title) {
      console.warn(`Video type asset does not contain title. ContentId: ${asset.contentId}`)
    }
  })

  // Grouping all assets by parent id (videos, channel)
  const uploadsStateGroupedByParentObjectId = Object.values(
    uploadsStateWithVideoTitles.reduce((acc: GroupByParentObjectIdAcc, asset) => {
      if (!asset) {
        return acc
      }
      const key = asset.parentObject.id
      !acc[key] ? (acc[key] = [{ ...asset }]) : acc[key].push(asset)
      return acc
    }, {})
  )

  // Will set all incompleted assets' status to error on initial mount
  const isInitialMount = useRef(true)
  useEffect(() => {
    if (!isInitialMount.current) {
      return
    }
    uploadsState.forEach((asset) => {
      if (asset.lastStatus !== 'completed') {
        updateAsset(asset.contentId, 'missing')
      }
    })
    isInitialMount.current = false
  }, [updateAsset, uploadsState])

  const displayUploadingNotification = useRef(
    debounce(() => {
      displaySnackbar({
        title:
          pendingNotificationsCounts.current.uploading > 1
            ? `${pendingNotificationsCounts.current.uploading} assets being uploaded`
            : 'Asset being uploaded',
        iconType: 'info',
        timeout: UPLOADING_SNACKBAR_TIMEOUT,
        actionText: 'See',
        onActionClick: () => navigate(absoluteRoutes.studio.uploads()),
      })
      pendingNotificationsCounts.current.uploading = 0
    }, 700)
  )

  const displayUploadedNotification = useRef(
    debounce(() => {
      displaySnackbar({
        title:
          pendingNotificationsCounts.current.uploaded > 1
            ? `${pendingNotificationsCounts.current.uploaded} assets uploaded`
            : 'Asset uploaded',
        iconType: 'success',
        timeout: UPLOADED_SNACKBAR_TIMEOUT,
        actionText: 'See',
        onActionClick: () => navigate(absoluteRoutes.studio.uploads()),
      })
      pendingNotificationsCounts.current.uploaded = 0
    }, 700)
  )

  const startFileUpload = useCallback(
    async (file: File | Blob | null, asset: InputAssetUpload, opts?: StartFileUploadOptions) => {
      const storageProvider = getStorageProvider()
      if (!storageProvider) {
        return
      }
      const { url: storageUrl, id: storageProviderId } = storageProvider

      console.debug(`Uploading to ${storageUrl}`)

      const setAssetUploadProgress = (progress: number) => {
        setUploadsProgress((prevState) => ({ ...prevState, [asset.contentId]: progress }))
      }
      const fileInState = assetsFiles?.find((file) => file.contentId === asset.contentId)
      if (!fileInState && file) {
        setAssetsFiles((prevState) => [...prevState, { contentId: asset.contentId, blob: file }])
      }

      rax.attach()
      const assetUrl = createStorageNodeUrl(asset.contentId, storageUrl)
      try {
        if (!fileInState && !file) {
          throw Error('File was not provided nor found')
        }
        if (!opts?.isReUpload && file) {
          addAsset({ ...asset, lastStatus: 'inProgress', size: file.size })
        }
        setAssetUploadProgress(0)

        const setUploadProgressThrottled = throttle(
          ({ loaded, total }: ProgressEvent) => {
            updateAsset(asset.contentId, 'inProgress')
            setAssetUploadProgress((loaded / total) * 100)
          },
          3000,
          { leading: true }
        )

        pendingNotificationsCounts.current.uploading++
        displayUploadingNotification.current()

        await axios.put(assetUrl.toString(), opts?.changeHost ? fileInState?.blob : file, {
          headers: {
            // workaround for a bug in the storage node
            'Content-Type': '',
          },
          raxConfig: {
            retry: RETRIES_COUNT,
            noResponseRetries: RETRIES_COUNT,
            retryDelay: 1000,
            backoffType: 'static',
            onRetryAttempt: (err) => {
              const cfg = rax.getConfig(err)
              if (cfg?.currentRetryAttempt === 1) {
                updateAsset(asset.contentId, 'reconnecting')
              }
            },
          },
          onUploadProgress: setUploadProgressThrottled,
        })

        // Cancel delayed functions that would overwrite asset status back to 'inProgres'
        setUploadProgressThrottled.cancel()

        // TODO: remove assets from the same parent if all finished
        updateAsset(asset.contentId, 'completed')
        setAssetUploadProgress(100)

        pendingNotificationsCounts.current.uploaded++
        displayUploadedNotification.current()
      } catch (e) {
        console.error('Failed to upload to storage provider', { storageUrl, error: e })
        updateAsset(asset.contentId, 'error')
        markStorageProviderNotWorking(storageProviderId)
        displaySnackbar({
          title: 'Failed to upload asset',
          description: 'Host is not responding',
          actionText: 'Go to uploads',
          onActionClick: () => navigate(absoluteRoutes.studio.uploads()),
          iconType: 'warning',
        })
      }
    },
    [addAsset, assetsFiles, displaySnackbar, getStorageProvider, markStorageProviderNotWorking, navigate, updateAsset]
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
