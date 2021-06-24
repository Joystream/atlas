import create from 'zustand'
import { persist } from 'zustand/middleware'

import { ChannelId, VideoId } from '@/joystream-lib'

import { AssetParent, AssetUpload, UploadStatus, UploadsStatusRecord } from './types'

type AssetFile = {
  contentId: string
  blob: File | Blob
}

type UploadStoreState = {
  uploads: AssetUpload[]
  addAsset: (asset: AssetUpload) => void
  removeAsset: (contentId: string) => void
  removeAssetsWithParent: (type: AssetParent, id: ChannelId | VideoId) => void
  uploadsStatus: UploadsStatusRecord
  setUploadStatus: (contentId: string, status: Partial<UploadStatus>) => void
  assetsFiles: AssetFile[]
  setAssetsFiles: (assetFile: AssetFile) => void
  isSyncing: boolean
  setIsSyncing: (isSyncing: boolean) => void
}

const UPLOADS_LOCAL_STORAGE_KEY = 'uploads'

export const useUploadsStore = create<UploadStoreState>(
  persist(
    (set) => ({
      uploads: [],
      uploadsStatus: {},
      assetsFiles: [],
      isSyncing: false,

      setUploadStatus: (contentId, status) => {
        set((state) => ({
          ...state,
          uploadsStatus: { ...state.uploadsStatus, [contentId]: { ...state.uploadsStatus[contentId], ...status } },
        }))
      },
      setAssetsFiles: (assetFile) => {
        set((state) => ({ ...state, assetFiles: [...state.assetsFiles, assetFile] }))
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
    }),
    {
      name: UPLOADS_LOCAL_STORAGE_KEY,
      migrate: (state) => {
        const uploads = window.localStorage.getItem(UPLOADS_LOCAL_STORAGE_KEY)
        return {
          ...state,
          uploads: JSON.parse(uploads || ''),
        }
      },
      whitelist: ['uploads'],
    }
  )
)
