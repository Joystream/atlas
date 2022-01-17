import { ChannelId, VideoId } from '@/joystream-lib'
import { createStore } from '@/store'
import { UploadStatus } from '@/types/storage'

import { AssetParent, AssetUpload, UploadsStatusRecord } from './types'

type AssetFile = {
  contentId: string
  blob: File | Blob
}

type UploadStoreState = {
  uploads: AssetUpload[]
  uploadsStatus: UploadsStatusRecord
  assetsFiles: AssetFile[]
  isSyncing: boolean
  processingAssetsIds: string[]
  // store ids of channels that were created as part of the session to ignore them when checking missing assets
  newChannelsIds: string[]
}

type UploadStoreActions = {
  addAssetToUploads: (asset: AssetUpload) => void
  removeAssetFromUploads: (contentId: string) => void
  removeAssetsWithParentFromUploads: (type: AssetParent, id: ChannelId | VideoId) => void
  setUploadStatus: (contentId: string, status: Partial<UploadStatus>) => void
  addAssetFile: (assetFile: AssetFile) => void
  setIsSyncing: (isSyncing: boolean) => void
  removeProcessingAssetId: (contentId: string) => void
  addProcessingAssetId: (contentId: string) => void
  addNewChannelId: (channelId: string) => void
}

const UPLOADS_LOCAL_STORAGE_KEY = 'uploads'

export const useUploadsStore = createStore<UploadStoreState, UploadStoreActions>(
  {
    actionsFactory: (set) => ({
      setUploadStatus: (contentId, status) => {
        set((state) => {
          state.uploadsStatus[contentId] = { ...state.uploadsStatus[contentId], ...status }
        })
      },
      addAssetFile: (assetFile) => {
        set((state) => {
          state.assetsFiles.push(assetFile)
        })
      },
      addAssetToUploads: (asset) => {
        set((state) => {
          state.uploads.push(asset)
        })
      },
      removeAssetFromUploads: (contentId) => {
        set((state) => {
          state.uploads = state.uploads.filter((asset) => asset.id !== contentId)
        })
      },
      removeAssetsWithParentFromUploads: (type, id) => {
        set((state) => {
          state.uploads = state.uploads.filter(
            (asset) => asset.parentObject.id !== id || asset.parentObject.type !== type
          )
        })
      },
      setIsSyncing: (isSyncing) => {
        set((state) => {
          state.isSyncing = isSyncing
        })
      },
      addProcessingAssetId: (contentId) => {
        set((state) => {
          state.processingAssetsIds.push(contentId)
        })
      },
      removeProcessingAssetId: (contentId) => {
        set((state) => {
          state.processingAssetsIds = state.processingAssetsIds.filter((id) => id !== contentId)
        })
      },
      addNewChannelId: (channelId) => {
        set((state) => {
          state.newChannelsIds.push(channelId)
        })
      },
    }),
    state: {
      uploads: [],
      uploadsStatus: {},
      assetsFiles: [],
      isSyncing: false,
      processingAssetsIds: [],
      newChannelsIds: [],
    },
  },
  {
    persist: {
      key: UPLOADS_LOCAL_STORAGE_KEY,
      whitelist: ['uploads', 'processingAssetsIds'],
      version: 0,
      migrate: (state) => {
        const uploads = window.localStorage.getItem(UPLOADS_LOCAL_STORAGE_KEY)
        return {
          ...state,
          uploads: JSON.parse(uploads || ''),
        }
      },
    },
  }
)
