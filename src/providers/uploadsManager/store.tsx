import create from 'zustand'
import { persist } from 'zustand/middleware'

import { AssetUpload, AssetUploadStatus, UploadsStatusRecord } from './types'

type AssetFile = {
  contentId: string
  blob: File | Blob
}

type UploadStoreState = {
  uploadsState: AssetUpload[]
  addAsset: (asset: AssetUpload) => void
  removeAsset: (contentId: string) => void
  assetsFiles: AssetFile[]
  setAssetsFiles: (assetFile: AssetFile) => void
  uploadsStatus: UploadsStatusRecord
  updateAsset: (contentId: string, opts: { lastStatus?: AssetUploadStatus; progress?: number }) => void
}

const UPLOADS_LOCAL_STORAGE_KEY = 'uploads'

export const useUploadsStore = create<UploadStoreState>(
  persist(
    (set) => ({
      uploadsState: [],
      assetsFiles: [],
      setAssetsFiles: (assetFile) => {
        set((state) => ({ ...state, assetFiles: [...state.assetsFiles, assetFile] }))
      },
      uploadsStatus: {},
      updateAsset: (contentId, opts) => {
        set((state) => {
          const lastStatus = opts.lastStatus
            ? { lastStatus: opts.lastStatus }
            : { lastStatus: state.uploadsStatus[contentId].lastStatus }
          const progress = opts.progress ? { progress: opts.progress } : {}
          return {
            ...state,
            uploadsStatus: {
              ...state.uploadsStatus,
              [contentId]: { ...lastStatus, ...progress },
            },
            uploadsState: state.uploadsState.map((asset) => {
              if (asset.contentId !== contentId) {
                return asset
              }
              const assetUpdates = opts.lastStatus ? { lastStatus: opts.lastStatus } : {}
              return { ...asset, ...assetUpdates }
            }),
          }
        })
      },
      addAsset: (asset) => {
        set((state) => ({ ...state, uploadsState: [...state.uploadsState, asset] }))
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
