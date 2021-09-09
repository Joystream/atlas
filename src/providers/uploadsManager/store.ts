import { ChannelId, VideoId } from '@/joystream-lib'
import { createStore } from '@/store'

import { AssetParent, AssetUpload, UploadStatus, UploadsStatusRecord } from './types'

type AssetFile = {
  contentId: string
  blob: File | Blob
}

type _UploadStoreState = {
  uploads: AssetUpload[]
  uploadsStatus: UploadsStatusRecord
  assetsFiles: AssetFile[]
  isSyncing: boolean
  pendingAssetsIds: string[]
}

type UploadStoreActions = {
  addAsset: (asset: AssetUpload) => void
  removeAsset: (contentId: string) => void
  removeAssetsWithParent: (type: AssetParent, id: ChannelId | VideoId) => void
  setUploadStatus: (contentId: string, status: Partial<UploadStatus>) => void
  addAssetFile: (assetFile: AssetFile) => void
  setIsSyncing: (isSyncing: boolean) => void
  removePendingAssetId: (contentId: string) => void
  addPendingAssetId: (contentId: string) => void
}

const UPLOADS_LOCAL_STORAGE_KEY = 'uploads'

export const useUploadsStore = createStore<_UploadStoreState, UploadStoreActions>(
  {
    actionsFactory: (set) => ({
      setUploadStatus: (contentId, status) => {
        set((state) => ({
          ...state,
          uploadsStatus: { ...state.uploadsStatus, [contentId]: { ...state.uploadsStatus[contentId], ...status } },
        }))
      },
      addAssetFile: (assetFile) => {
        set((state) => ({ ...state, assetsFiles: [...state.assetsFiles, assetFile] }))
      },
      addAsset: (asset) => {
        set((state) => ({ ...state, uploads: [...state.uploads, asset] }))
      },
      removeAsset: (contentId) => {
        set((state) => ({
          ...state,
          uploads: state.uploads.filter((asset) => asset.contentId !== contentId),
        }))
      },
      removeAssetsWithParent: (type, id) => {
        set((state) => ({
          ...state,
          uploads: state.uploads.filter((asset) => asset.parentObject.id !== id || asset.parentObject.type !== type),
        }))
      },
      setIsSyncing: (isSyncing) => {
        set((state) => ({ ...state, isSyncing: isSyncing }))
      },
      addPendingAssetId: (contentId) => {
        set((state) => {
          return { ...state, pendingAssetsIds: [...state.pendingAssetsIds, contentId] }
        })
      },
      removePendingAssetId: (contentId) => {
        set((state) => {
          return { ...state, pendingAssets: state.pendingAssetsIds.filter((id) => id !== contentId) }
        })
      },
    }),
    state: {
      uploads: [],
      uploadsStatus: {},
      assetsFiles: [],
      isSyncing: false,
      pendingAssetsIds: [],
    },
  },
  {
    persist: {
      key: UPLOADS_LOCAL_STORAGE_KEY,
      whitelist: ['uploads'],
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
