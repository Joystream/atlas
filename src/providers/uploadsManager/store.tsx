import create from 'zustand'
import { persist } from 'zustand/middleware'

import { AssetUpload, AssetUploadStatus, UploadsProgressRecord } from './types'

type AssetFile = {
  contentId: string
  blob: File | Blob
}

type UploadStoreState = {
  uploadsState: AssetUpload[]
  addAsset: (asset: AssetUpload) => void
  updateAsset: (contentId: string, lastStatus: AssetUploadStatus) => void
  removeAsset: (contentId: string) => void
  uploadsProgress: UploadsProgressRecord
  setUploadsProgress: (contentId: string, progress: number) => void
  assetsFiles: AssetFile[]
  setAssetsFiles: (assetFile: AssetFile) => void
}

const UPLOADS_LOCAL_STORAGE_KEY = 'uploads'

export const useUploadsStore = create<UploadStoreState>(
  persist(
    (set) => ({
      uploadsState: [],
      uploadsProgress: {},
      setUploadsProgress: (contentId, progress) => {
        set((state) => ({ ...state, uploadsProgress: { ...state.uploadsProgress, [contentId]: progress } }))
      },
      assetsFiles: [],
      setAssetsFiles: (assetFile) => {
        set((state) => ({ ...state, assetFiles: [...state.assetsFiles, assetFile] }))
      },
      addAsset: (asset) => {
        set((state) => ({ ...state, uploadsState: [...state.uploadsState, asset] }))
      },
      updateAsset: (contentId, lastStatus?) => {
        set((state) => ({
          ...state,
          uploadsState: state.uploadsState.map((asset) => {
            if (asset.contentId !== contentId) {
              return asset
            }
            const assetUpdates = lastStatus ? { lastStatus } : {}
            return { ...asset, ...assetUpdates }
          }),
        }))
      },
      removeAsset: (contentId) => {
        set((state) => ({
          ...state,
          uploadsState: state.uploadsState.filter((asset) => asset.contentId !== contentId),
        }))
      },
    }),
    {
      name: UPLOADS_LOCAL_STORAGE_KEY,
      migrate: (state) => {
        const uploads = window.localStorage.getItem(UPLOADS_LOCAL_STORAGE_KEY)
        return {
          ...state,
          uploadsState: JSON.parse(uploads || ''),
        }
      },
      whitelist: ['uploadsState'],
    }
  )
)
