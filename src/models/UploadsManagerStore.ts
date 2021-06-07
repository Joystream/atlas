import { LiaisonJudgement } from '@/api/queries'
import { StartFileUploadOptions } from '@/hooks/useUploadsManager/types'
import { SnapshotOrInstance, types, cast, Instance, flow, getRoot } from 'mobx-state-tree'
import * as rax from 'retry-axios'
import axios from 'axios'
import { createStorageNodeUrl } from '@/utils/asset'
import { RootStoreIntance } from './RootStore'
import { debounce } from 'lodash'
import { absoluteRoutes } from '@/config/routes'
import { ImageCropData } from '@/types/cropper'
import { when } from 'mobx'

export type AssetFile = {
  contentId: string
  blob: File | Blob
}

const RETRIES_COUNT = 5
const UPLOADING_SNACKBAR_TIMEOUT = 8000
const UPLOADED_SNACKBAR_TIMEOUT = 13000
const RECONNECTION_ERROR_MESSAGE = 'Reconnection failed'

const AssetDimensions = types.model('AssetUpload', {
  width: types.number,
  height: types.number,
})

const ParentObject = types.model('AssetUpload', {
  type: types.enumeration(['video', 'channel']),
  id: types.string,
})

export const AssetUpload = types.model('AssetUpload', {
  contentId: types.identifier,
  parentObject: ParentObject,
  owner: types.string,
  type: types.enumeration<'video' | 'thumbnail' | 'cover' | 'avatar'>('Type', [
    'video',
    'thumbnail',
    'cover',
    'avatar',
  ]),
  lastStatus: types.maybe(types.enumeration(['completed', 'inProgress', 'error', 'reconnecting', 'reconnectionError'])),
  liaisonJudgement: types.maybe(
    types.enumeration<LiaisonJudgement>('LiaisonJudgement', Object.values(LiaisonJudgement))
  ),
  ipfsContentId: types.maybe(types.string),
  size: types.maybe(types.number), // size in bytes
  dimensions: types.maybe(AssetDimensions),
  imageCropData: types.maybe(types.frozen<ImageCropData>()),
  metadata: types.maybe(types.string),
  title: types.maybe(types.union(types.string, types.null)),
  progress: types.optional(types.number, 0),
})

export const UploadsManagerStore = types
  .model('UploadsManagerStore', {
    uploadingAssetsState: types.array(AssetUpload),
  })
  .volatile((self) => {
    const assetsFiles: AssetFile[] = []
    const pendingNotificationsCounts = { uploading: 0, uploaded: 0 }
    const displayUploadingNotification = debounce(() => {
      getRoot<RootStoreIntance>(self).snackbarStore.displaySnackbar(
        {
          title:
            pendingNotificationsCounts.uploading > 1
              ? `${pendingNotificationsCounts.uploading} assets being uploaded`
              : 'Asset being uploaded',
          iconType: 'info',
          timeout: UPLOADING_SNACKBAR_TIMEOUT,
          actionText: 'See',
        },
        () => getRoot<RootStoreIntance>(self).hooks.navigate(absoluteRoutes.studio.uploads())
      )
      pendingNotificationsCounts.uploading = 0
    }, 700)
    const displayUploadedNotification = debounce(() => {
      getRoot<RootStoreIntance>(self).snackbarStore.displaySnackbar?.(
        {
          title:
            pendingNotificationsCounts.uploaded > 1
              ? `${pendingNotificationsCounts.uploaded} assets uploaded`
              : 'Asset uploaded',
          iconType: 'success',
          timeout: UPLOADED_SNACKBAR_TIMEOUT,
          actionText: 'See',
        },
        () => getRoot<RootStoreIntance>(self).hooks.navigate(absoluteRoutes.studio.uploads())
      )
      pendingNotificationsCounts.uploaded = 0
    }, 700)

    return { assetsFiles, pendingNotificationsCounts, displayUploadingNotification, displayUploadedNotification }
  })
  .actions((self) => {
    function afterAttach() {
      // allow some time for the store to be hydrated from local storage
      when(
        () => self.uploadingAssetsState.length > 0,
        () => {
          // Will set all incompleted assets' status to error from previous sessions
          self.uploadingAssetsState.forEach((asset) => {
            if (asset.lastStatus !== 'completed' && asset.lastStatus !== 'error') {
              asset.lastStatus = 'error'
            }
          })
        },
        { timeout: 1000 }
      )
    }
    function addAsset(asset: SnapshotOrInstance<typeof AssetUpload>) {
      self.uploadingAssetsState.push(asset)
    }
    function updateAsset(asset: SnapshotOrInstance<typeof AssetUpload>) {
      const index = self.uploadingAssetsState.findIndex((a) => a.contentId === asset.contentId)
      if (index >= 0) {
        self.uploadingAssetsState[index] = { ...self.uploadingAssetsState[index], ...cast(asset) }
      }
    }
    function removeAsset(asset: SnapshotOrInstance<typeof AssetUpload>) {
      self.uploadingAssetsState.remove(cast(asset))
    }
    return { addAsset, updateAsset, removeAsset, afterAttach }
  })
  .actions((self) => {
    const startFileUpload = flow(function* startFileUpload(
      file: File | Blob | null,
      asset: IAssetUpload,
      storageMetadata: string,
      opts?: StartFileUploadOptions
    ) {
      const fileInState = self.assetsFiles?.find((file) => file.contentId === asset.contentId)
      if (!fileInState && file) {
        self.assetsFiles = [...self.assetsFiles, { contentId: asset.contentId, blob: file }]
      }
      rax.attach()
      try {
        if (!fileInState && !file) {
          throw Error('File was not provided nor found')
        }
        if (!opts?.isReUpload && file) {
          self.addAsset(AssetUpload.create({ ...asset, lastStatus: 'inProgress', size: file.size, progress: 0 }))
        }
        const assetUrl = createStorageNodeUrl(asset.contentId, storageMetadata)
        const setUploadProgress = ({ loaded, total }: ProgressEvent) => {
          self.updateAsset({ ...asset, lastStatus: 'inProgress', progress: (loaded / total) * 100 })
        }
        self.pendingNotificationsCounts.uploading++
        self.displayUploadingNotification()

        yield axios.put(assetUrl.toString(), opts?.changeHost ? fileInState?.blob : file, {
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
                self.updateAsset({
                  ...asset,
                  lastStatus: 'reconnecting',
                })
              }
              if (cfg?.currentRetryAttempt === RETRIES_COUNT) {
                throw Error(RECONNECTION_ERROR_MESSAGE)
              }
            },
          },
          onUploadProgress: setUploadProgress,
        })
        // TODO: remove assets from the same parent if all finished
        self.updateAsset({
          ...asset,
          lastStatus: 'completed',
          progress: 100,
        })
        self.pendingNotificationsCounts.uploaded++
        self.displayUploadedNotification()
      } catch (e) {
        console.error('Upload failed', e)
        if (e.message === RECONNECTION_ERROR_MESSAGE) {
          self.updateAsset({
            ...asset,
            lastStatus: 'reconnectionError',
          })
          getRoot<RootStoreIntance>(self).snackbarStore.displaySnackbar?.(
            {
              title: 'Asset failing to reconnect',
              description: 'Host is not responding',
              actionText: 'Go to uploads',
              iconType: 'warning',
            },
            () => getRoot<RootStoreIntance>(self).hooks.navigate(absoluteRoutes.studio.uploads())
          )
        } else {
          if (asset)
            self.updateAsset({
              ...asset,
              lastStatus: 'error',
            })
        }
      }
    })
    return { startFileUpload }
  })

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAssetUpload extends Instance<typeof AssetUpload> {}
