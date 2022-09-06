import { UPLOAD_PROCESSING_TIMEOUT } from '@/config/assets'
import { ChannelId, VideoId } from '@/joystream-lib/types'
import { createStore } from '@/store'
import { UploadStatus } from '@/types/storage'

import { AssetParent, AssetUpload, UploadsStatusRecord } from './uploads.types'

type AssetFile = {
  contentId: string
  blob: File | Blob
}

type ProcessingAsset = {
  // unix timestamp
  expiresAt: number
  id: string
}

type UploadStoreState = {
  uploads: AssetUpload[]
  uploadsStatus: UploadsStatusRecord
  assetsFiles: AssetFile[]
  isSyncing: boolean
  processingAssets: ProcessingAsset[]
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
  removeProcessingAsset: (contentId: string) => void
  addProcessingAsset: (contentId: string) => void
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
      addProcessingAsset: (contentId) => {
        set((state) => {
          state.processingAssets.push({ id: contentId, expiresAt: Date.now() + UPLOAD_PROCESSING_TIMEOUT })
        })
      },
      removeProcessingAsset: (contentId) => {
        set((state) => {
          state.processingAssets = state.processingAssets.filter((processingAsset) => processingAsset.id !== contentId)
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
      processingAssets: [],
      newChannelsIds: [],
    },
  },
  {
    persist: {
      key: UPLOADS_LOCAL_STORAGE_KEY,
      whitelist: ['uploads', 'processingAssets'],
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
