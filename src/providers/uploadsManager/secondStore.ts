import create from 'zustand'

import { InputAssetUpload, StartFileUploadOptions } from './types'

type UploadStoreState = {
  pendingAssets: Record<string, { file: File | Blob | null; asset: InputAssetUpload; opts?: StartFileUploadOptions }>
  pendingAssetsId: string[]
  removePendingAsset: (contentId: string) => void
  addPendingAsset: (
    contentId: string,
    file: File | Blob | null,
    asset: InputAssetUpload,
    opts?: StartFileUploadOptions
  ) => void
  addPendingAssetId: (contentId: string) => void
}

export const useSecondStore = create<UploadStoreState>((set) => ({
  pendingAssets: {},
  pendingAssetsId: [],
  addPendingAsset: (contentId, file, asset, opts) => {
    set((state) => {
      return {
        ...state,
        pendingAssets: {
          ...state.pendingAssets,
          [contentId]: {
            file,
            asset,
            opts,
          },
        },
      }
    })
  },
  addPendingAssetId: (contentId) => {
    set((state) => ({ ...state, pendingAssetsId: [contentId, ...state.pendingAssetsId] }))
  },
  removePendingAsset: (contentId) => {
    set((state) => {
      const { [contentId]: toRemove, ...rest } = state.pendingAssets
      return { ...state, pendingAssets: { ...rest } }
    })
  },
}))
