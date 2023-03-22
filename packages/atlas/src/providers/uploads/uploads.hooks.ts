import axios, { AxiosError, AxiosProgressEvent, AxiosRequestConfig } from 'axios'
import { debounce } from 'lodash-es'
import { useCallback, useRef } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router'
import * as rax from 'retry-axios'
import { RetryConfig } from 'retry-axios'

import { absoluteRoutes } from '@/config/routes'
import { useStorageOperators } from '@/providers/assets/assets.provider'
import { OperatorInfo } from '@/providers/assets/assets.types'
import { UploadStatus } from '@/types/storage'
import { createAssetUploadEndpoint, createChannelBagId } from '@/utils/asset'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

import { useUploadsStore } from './uploads.store'
import { InputAssetUpload, StartFileUploadOptions } from './uploads.types'

import { useSnackbar } from '../snackbars'

const RETRIES_COUNT = 3
const RETRY_DELAY = 1000
const UPLOADING_SNACKBAR_TIMEOUT = 8000

type MutationParams = {
  url: string
  data: FormData
  config: AxiosRequestConfig
}

export const useStartFileUpload = () => {
  const navigate = useNavigate()
  const { displaySnackbar } = useSnackbar()
  const { getClosestStorageOperatorForBag, markStorageOperatorFailed } = useStorageOperators()
  const { mutateAsync: uploadMutation } = useMutation('subtitles-fetch', (params: MutationParams) =>
    axios.post(params.url, params.data, params.config)
  )

  const { addAssetFile, addAssetToUploads, setUploadStatus, addProcessingAsset } = useUploadsStore(
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
      const bagId = createChannelBagId(asset.owner)
      try {
        const storageOperator = await getClosestStorageOperatorForBag(bagId)
        if (!storageOperator) {
          displaySnackbar({
            title: 'Failed to upload asset',
            description:
              'None of the storage operators are available at this time. Please reload the app and try again later.',
            iconType: 'error',
          })
          SentryLogger.error('No storage operator available for upload', 'uploadsHooks')
          return
        }
        uploadOperator = storageOperator
      } catch (e) {
        SentryLogger.error('Failed to get storage operator for upload', 'uploadsHooks', e)
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
          addAssetToUploads({
            ...asset,
            name: asset.name,
            size: file.size.toString(),
            hasNft: opts?.hasNft,
          })
        }

        setAssetStatus({ lastStatus: 'inProgress', progress: 0 })

        const setUploadProgress = ({ loaded, total }: AxiosProgressEvent) => {
          const progress = (total ? loaded / total : 0) * 100
          setAssetStatus({ progress })

          if (progress === 100) {
            addProcessingAsset(asset.id)
            setAssetStatus({ lastStatus: 'processing', progress })
          }
        }

        pendingUploadingNotificationsCounts.current++
        displayUploadingNotification.current()
        assetsNotificationsCount.current.uploads[assetKey] =
          (assetsNotificationsCount.current.uploads[assetKey] || 0) + 1

        const formData = new FormData()
        formData.append('file', fileToUpload, asset.name)

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

        await uploadMutation({
          url: createAssetUploadEndpoint(uploadOperator.endpoint, {
            dataObjectId: asset.id,
            storageBucketId: uploadOperator.id,
            bagId,
          }),
          data: formData,
          config: {
            raxConfig,
            onUploadProgress: setUploadProgress,
          },
        })

        assetsNotificationsCount.current.uploaded[assetKey] =
          (assetsNotificationsCount.current.uploaded[assetKey] || 0) + 1
      } catch (e) {
        SentryLogger.error('Failed to upload asset', 'uploadsHooks', e, {
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
      getClosestStorageOperatorForBag,
      displaySnackbar,
      setUploadStatus,
      addAssetFile,
      uploadMutation,
      addAssetToUploads,
      addProcessingAsset,
      markStorageOperatorFailed,
      navigate,
    ]
  )

  return startFileUpload
}
