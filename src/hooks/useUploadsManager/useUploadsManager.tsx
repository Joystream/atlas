import axios, { AxiosError } from 'axios'
import { throttle, debounce } from 'lodash'
import React, { useCallback, useContext, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import * as rax from 'retry-axios'

import { useChannel, useVideos } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { useSnackbar, useUser, useStorageProviders } from '@/hooks'
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
const RETRY_DELAY = 1000
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
  // \/ workaround for now to not show completed uploads but not delete them since we may want to show history of uploads in the future
  const [ignoredAssetsIds, setIgnoredAssetsIds] = useState<string[]>([])
  const [assetsFiles, setAssetsFiles] = useState<AssetFile[]>([])
  const { activeChannelId } = useUser()
  const { loading: channelLoading } = useChannel(activeChannelId ?? '')
  const { loading: videosLoading } = useVideos(
    {
      where: {
        id_in: uploadsState.filter((item) => item.parentObject.type === 'video').map((item) => item.parentObject.id),
      },
    },
    { skip: !uploadsState.length }
  )

  const pendingNotificationsCounts = useRef(0)
  type AssetParentObjectID = string
  const assetsNotificationsCount = useRef<{
    uploading: AssetParentObjectID[]
    uploaded: AssetParentObjectID[]
  }>({
    uploading: [],
    uploaded: [],
  })

  // Will set all incomplete assets' status to missing on initial mount
  const isInitialMount = useRef(true)
  useEffect(() => {
    if (!isInitialMount.current) {
      return
    }
    isInitialMount.current = false

    let missingAssetsCount = 0
    uploadsState.forEach((asset) => {
      if (asset.lastStatus !== 'completed') {
        updateAsset(asset.contentId, 'missing')
        missingAssetsCount++
      } else {
        setIgnoredAssetsIds((ignored) => [...ignored, asset.contentId])
      }
    })

    if (missingAssetsCount > 0) {
      displaySnackbar({
        title: `(${missingAssetsCount}) Asset${missingAssetsCount > 1 ? 's' : ''} waiting to resume upload`,
        description: 'Reconnect files to fix the issue',
        actionText: 'See',
        onActionClick: () => navigate(absoluteRoutes.studio.uploads()),
        iconType: 'warning',
      })
    }
  }, [updateAsset, uploadsState, displaySnackbar, navigate])

  const filteredUploadStateWithProgress: AssetUploadWithProgress[] = uploadsState
    .filter((asset) => asset.owner === activeChannelId && !ignoredAssetsIds.includes(asset.contentId))
    .map((asset) => ({
      ...asset,
      progress: uploadsProgress[asset.contentId] ?? 0,
    }))

  // Grouping all assets by parent id (videos, channel)
  const groupedUploadsState = Object.values(
    filteredUploadStateWithProgress.reduce((acc: GroupByParentObjectIdAcc, asset) => {
      if (!asset) {
        return acc
      }
      const key = asset.parentObject.id
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(asset)
      return acc
    }, {})
  )

  const displayUploadingNotification = useRef(
    debounce(() => {
      displaySnackbar({
        title:
          pendingNotificationsCounts.current > 1
            ? `${pendingNotificationsCounts.current} assets being uploaded`
            : 'Asset being uploaded',
        iconType: 'info',
        timeout: UPLOADING_SNACKBAR_TIMEOUT,
        actionText: 'See',
        onActionClick: () => navigate(absoluteRoutes.studio.uploads()),
      })
      pendingNotificationsCounts.current = 0
    }, 700)
  )

  const displayUploadedNotification = useRef(
    debounce((id?: string) => {
      const uploadCount = assetsNotificationsCount.current.uploading.filter((itemId) => itemId === id).length
      const uploadedCount = assetsNotificationsCount.current.uploaded.filter((itemId) => itemId === id).length

      displaySnackbar({
        customId: id,
        title: `${uploadedCount}/${uploadCount} assets uploaded`,
        iconType: 'success',
        timeout: UPLOADED_SNACKBAR_TIMEOUT,
        actionText: 'See',
        onActionClick: () => navigate(absoluteRoutes.studio.uploads()),
      })
      if (uploadedCount === uploadCount) {
        assetsNotificationsCount.current.uploading = assetsNotificationsCount.current.uploading.filter(
          (itemId) => itemId !== id
        )
        assetsNotificationsCount.current.uploaded = assetsNotificationsCount.current.uploaded.filter(
          (itemId) => itemId !== id
        )
      }
    }, 700)
  )

  const startFileUpload = useCallback(
    async (file: File | Blob | null, asset: InputAssetUpload, opts?: StartFileUploadOptions) => {
      let storageUrl: string, storageProviderId: string
      try {
        const storageProvider = getStorageProvider()
        if (!storageProvider) {
          return
        }
        storageUrl = storageProvider.url
        storageProviderId = storageProvider.id
      } catch (e) {
        console.error('Failed to find storage provider', e)
        return
      }

      console.debug(`Uploading to ${storageUrl}`)

      const setAssetUploadProgress = (progress: number) => {
        setUploadsProgress((prevState) => ({ ...prevState, [asset.contentId]: progress }))
      }
      const fileInState = assetsFiles?.find((file) => file.contentId === asset.contentId)
      if (!fileInState && file) {
        setAssetsFiles((prevState) => [...prevState, { contentId: asset.contentId, blob: file }])
      }

      try {
        rax.attach()
        const assetUrl = createStorageNodeUrl(asset.contentId, storageUrl)
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

        pendingNotificationsCounts.current++
        assetsNotificationsCount.current.uploading.push(asset.parentObject.id)
        displayUploadingNotification.current()

        await axios.put(assetUrl.toString(), opts?.changeHost ? fileInState?.blob : file, {
          headers: {
            // workaround for a bug in the storage node
            'Content-Type': '',
          },
          raxConfig: {
            retry: RETRIES_COUNT,
            noResponseRetries: RETRIES_COUNT,
            // add 400 to default list of codes to retry
            // seems storage node sometimes fails to calculate the IFPS hash correctly
            // trying again in that case should succeed
            statusCodesToRetry: [
              [100, 199],
              [400, 400],
              [429, 429],
              [500, 599],
            ],
            retryDelay: RETRY_DELAY,
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
        assetsNotificationsCount.current.uploaded.push(asset.parentObject.id)
        displayUploadedNotification.current(asset.parentObject.id)
      } catch (e) {
        console.error('Failed to upload to storage provider', { storageUrl, error: e })
        updateAsset(asset.contentId, 'error')
        setAssetUploadProgress(0)

        const axiosError = e as AxiosError
        const networkFailure =
          axiosError.isAxiosError &&
          (!axiosError.response?.status || (axiosError.response.status < 400 && axiosError.response.status >= 500))
        if (networkFailure) {
          markStorageProviderNotWorking(storageProviderId)
        }

        const snackbarDescription = networkFailure ? 'Host is not responding' : 'Unexpected error occurred'
        displaySnackbar({
          title: 'Failed to upload asset',
          description: snackbarDescription,
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
        uploadsState: groupedUploadsState,
      }}
    >
      {children}
    </UploadManagerContext.Provider>
  )
}

export const useUploadsManager = () => {
  const ctx = useContext(UploadManagerContext)
  if (ctx === undefined) {
    throw new Error('useUploadsManager must be used within a UploadManagerProvider')
  }
  return ctx
}
