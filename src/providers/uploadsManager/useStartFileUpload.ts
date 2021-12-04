import axios, { AxiosError } from 'axios'
import { debounce } from 'lodash-es'
import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router'
import * as rax from 'retry-axios'

import { absoluteRoutes } from '@/config/routes'
import { UploadStatus } from '@/types/storage'
import { createStorageNodeUrl } from '@/utils/asset'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

import { useUploadsStore } from './store'
import { InputAssetUpload, StartFileUploadOptions } from './types'

import { useSnackbar } from '../snackbars'
import { useStorageProviders } from '../storageProviders'

const RETRIES_COUNT = 3
const RETRY_DELAY = 1000
const UPLOADING_SNACKBAR_TIMEOUT = 8000

export const useStartFileUpload = () => {
  const navigate = useNavigate()
  const { displaySnackbar } = useSnackbar()
  const { getRandomStorageProvider, markStorageProviderNotWorking } = useStorageProviders()

  const { addAssetFile, addAssetToUploads, setUploadStatus, addProcessingAssetId } = useUploadsStore(
    (state) => state.actions
  )
  const assetsFiles = useUploadsStore((state) => state.assetsFiles)
  const pendingUploadingNotificationsCounts = useRef(0)
  const assetsNotificationsCount = useRef<{
    uploads: {
      [key: string]: number
    }
    uploaded: {
      [key: string]: number
    }
  }>({
    uploads: {},
    uploaded: {},
  })

  const displayUploadingNotification = useRef(
    debounce(() => {
      displaySnackbar({
        title: `${pendingUploadingNotificationsCounts.current} ${
          pendingUploadingNotificationsCounts.current > 1 ? 'files' : 'file'
        } added to uploads`,
        iconType: 'uploading',
        timeout: UPLOADING_SNACKBAR_TIMEOUT,
        actionText: 'Inspect',
        onActionClick: () => navigate(absoluteRoutes.studio.uploads()),
      })
      pendingUploadingNotificationsCounts.current = 0
    }, 700)
  )

  const startFileUpload = useCallback(
    async (file: File | Blob | null, asset: InputAssetUpload, opts?: StartFileUploadOptions) => {
      let storageUrl: string, storageProviderId: string
      try {
        const storageProvider = await getRandomStorageProvider()
        if (!storageProvider) {
          SentryLogger.error('No storage provider available for upload', 'UploadsManager')
          return
        }
        storageUrl = storageProvider.url
        storageProviderId = storageProvider.id
      } catch (e) {
        SentryLogger.error('Failed to get storage provider for upload', 'UploadsManager', e)
        return
      }

      ConsoleLogger.debug('Starting file upload', {
        contentId: asset.id,
        storageProviderId,
        storageProviderUrl: storageUrl,
      })

      const setAssetStatus = (status: Partial<UploadStatus>) => {
        setUploadStatus(asset.id, status)
      }
      const fileInState = assetsFiles?.find((file) => file.contentId === asset.id)
      if (!fileInState && file) {
        addAssetFile({ contentId: asset.id, blob: file })
      }

      const assetKey = `${asset.parentObject.type}-${asset.parentObject.id}`
      const assetUrl = createStorageNodeUrl(asset.id, storageUrl)

      try {
        if (!fileInState && !file) {
          throw Error('File was not provided nor found')
        }
        rax.attach()
        if (!opts?.isReUpload && !opts?.changeHost && file) {
          addAssetToUploads({ ...asset, size: file.size })
        }

        setAssetStatus({ lastStatus: 'inProgress', progress: 0 })

        const setUploadProgress = ({ loaded, total }: ProgressEvent) => {
          setAssetStatus({ progress: (loaded / total) * 100 })
        }

        pendingUploadingNotificationsCounts.current++
        displayUploadingNotification.current()

        assetsNotificationsCount.current.uploads[assetKey] =
          (assetsNotificationsCount.current.uploads[assetKey] || 0) + 1
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
              if (cfg?.currentRetryAttempt || 0 >= 1) {
                setAssetStatus({ lastStatus: 'reconnecting', retries: cfg?.currentRetryAttempt })
              }
            },
          },
          onUploadProgress: setUploadProgress,
        })

        setAssetStatus({ lastStatus: 'processing', progress: 100 })
        addProcessingAssetId(asset.id)

        assetsNotificationsCount.current.uploaded[assetKey] =
          (assetsNotificationsCount.current.uploaded[assetKey] || 0) + 1

        const performanceEntries = performance.getEntriesByName(assetUrl)
        if (performanceEntries.length === 1) {
          // TODO: enable back
          // AssetLogger.uploadRequestMetric(assetDetails, performanceEntries[0].duration, file?.size || 0)
        }
      } catch (e) {
        SentryLogger.error('Failed to upload asset', 'UploadsManager', e, {
          asset: { contentId: asset.id, storageProviderId, storageProviderUrl: storageUrl, assetUrl },
        })
        // AssetLogger.uploadError(assetDetails)

        setAssetStatus({ lastStatus: 'error', progress: 0 })

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
    [
      assetsFiles,
      getRandomStorageProvider,
      setUploadStatus,
      addAssetFile,
      addProcessingAssetId,
      addAssetToUploads,
      displaySnackbar,
      markStorageProviderNotWorking,
      navigate,
    ]
  )

  return startFileUpload
}
