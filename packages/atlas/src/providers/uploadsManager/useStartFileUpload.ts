import axios, { AxiosError } from 'axios'
import { debounce } from 'lodash-es'
import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router'
import * as rax from 'retry-axios'
import { RetryConfig } from 'retry-axios'

import { ASSET_CHANNEL_BAG_PREFIX } from '@/config/assets'
import { absoluteRoutes } from '@/config/routes'
import { UploadStatus } from '@/types/storage'
import { createAssetUploadEndpoint } from '@/utils/asset'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

import { useUploadsStore } from './store'
import { InputAssetUpload, StartFileUploadOptions } from './types'

import { OperatorInfo, useStorageOperators } from '../assets'
import { useSnackbar } from '../snackbars'

const RETRIES_COUNT = 3
const RETRY_DELAY = 1000
const UPLOADING_SNACKBAR_TIMEOUT = 8000

export const useStartFileUpload = () => {
  const navigate = useNavigate()
  const { displaySnackbar } = useSnackbar()
  const { getRandomStorageOperatorForBag, markStorageOperatorFailed } = useStorageOperators()

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
      let uploadOperator: OperatorInfo
      const bagId = ASSET_CHANNEL_BAG_PREFIX + asset.owner
      try {
        const storageOperator = await getRandomStorageOperatorForBag(bagId)
        if (!storageOperator) {
          SentryLogger.error('No storage operator available for upload', 'useStartFileUpload')
          return
        }
        uploadOperator = storageOperator
      } catch (e) {
        SentryLogger.error('Failed to get storage operator for upload', 'useStartFileUpload', e)
        return
      }

      ConsoleLogger.debug('Starting file upload', {
        contentId: asset.id,
        uploadOperator,
      })

      const setAssetStatus = (status: Partial<UploadStatus>) => {
        setUploadStatus(asset.id, status)
      }
      const fileInState = assetsFiles?.find((file) => file.contentId === asset.id)
      if (!fileInState && file) {
        addAssetFile({ contentId: asset.id, blob: file })
      }

      const assetKey = `${asset.parentObject.type}-${asset.parentObject.id}`

      try {
        const fileToUpload = opts?.changeHost ? fileInState?.blob : file
        if (!fileToUpload) {
          throw new Error('File was not provided nor found')
        }

        if (!opts?.isReUpload && !opts?.changeHost && file) {
          addAssetToUploads({ ...asset, size: file.size.toString() })
        }

        setAssetStatus({ lastStatus: 'inProgress', progress: 0 })

        const setUploadProgress = ({ loaded, total }: ProgressEvent) => {
          setAssetStatus({ progress: (loaded / total) * 100 })

          if ((loaded / total) * 100 === 100) {
            addProcessingAssetId(asset.id)
            setAssetStatus({ lastStatus: 'processing', progress: (loaded / total) * 100 })
          }
        }

        pendingUploadingNotificationsCounts.current++
        displayUploadingNotification.current()
        assetsNotificationsCount.current.uploads[assetKey] =
          (assetsNotificationsCount.current.uploads[assetKey] || 0) + 1

        const formData = new FormData()
        formData.append('dataObjectId', asset.id)
        formData.append('storageBucketId', uploadOperator.id)
        formData.append('bagId', bagId)
        formData.append('file', fileToUpload, (file as File).name)

        rax.attach()
        const raxConfig: RetryConfig = {
          retry: RETRIES_COUNT,
          noResponseRetries: RETRIES_COUNT,
          retryDelay: RETRY_DELAY,
          backoffType: 'static',
          onRetryAttempt: (err) => {
            const cfg = rax.getConfig(err)
            if (cfg?.currentRetryAttempt || 0 >= 1) {
              setAssetStatus({ lastStatus: 'reconnecting', retries: cfg?.currentRetryAttempt })
            }
          },
        }

        await axios.post(createAssetUploadEndpoint(uploadOperator.endpoint), formData, {
          raxConfig,
          onUploadProgress: setUploadProgress,
        })

        assetsNotificationsCount.current.uploaded[assetKey] =
          (assetsNotificationsCount.current.uploaded[assetKey] || 0) + 1
      } catch (e) {
        SentryLogger.error('Failed to upload asset', 'useStartFileUpload', e, {
          asset: { dataObjectId: asset.id, uploadOperator },
        })

        setAssetStatus({ lastStatus: 'error', progress: 0 })

        const axiosError = e as AxiosError
        const networkFailure =
          axiosError.isAxiosError &&
          (!axiosError.response?.status || (axiosError.response.status < 400 && axiosError.response.status >= 500))
        if (networkFailure) {
          markStorageOperatorFailed(uploadOperator.id)
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
      getRandomStorageOperatorForBag,
      setUploadStatus,
      addAssetFile,
      addProcessingAssetId,
      addAssetToUploads,
      displaySnackbar,
      markStorageOperatorFailed,
      navigate,
    ]
  )

  return startFileUpload
}
