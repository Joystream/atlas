import { StorageDataObjectFieldsFragment } from '@/api/queries'
import { createStore } from '@/store'

type ResolvedAsset = {
  url?: string | null
  blob?: File | Blob | null
}

type AssetStoreState = {
  assets: Record<string, ResolvedAsset> // mapping of content ID to resolved assets
  pendingAssets: Record<string, StorageDataObjectFieldsFragment> // list of content IDs pending resolution
  assetIdsBeingResolved: Set<string> // list of content IDs being currently resolved
}

type AssetStoreActions = {
  addAsset: (contentId: string, asset: ResolvedAsset) => void
  addPendingAsset: (contentId: string, storageDataObject: StorageDataObjectFieldsFragment) => void
  removePendingAsset: (contentId: string) => void
  addAssetBeingResolved: (contentId: string) => void
  removeAssetBeingResolved: (contentId: string) => void
}

export const useAssetStore = createStore<AssetStoreState, AssetStoreActions>({
  state: {
    assets: {},
    pendingAssets: {},
    assetIdsBeingResolved: new Set(),
  },
  actionsFactory: (set) => ({
    addAsset: (contentId, asset) => {
      set((state) => {
        state.assets[contentId] = asset
      })
    },
    addPendingAsset: (contentId, storageDataObject) => {
      set((state) => {
        if (state.pendingAssets[contentId]) return
        state.pendingAssets[contentId] = storageDataObject
      })
    },
    removePendingAsset: (contentId) => {
      set((state) => {
        delete state.pendingAssets[contentId]
      })
    },
    addAssetBeingResolved: (contentId) => {
      set((state) => {
        state.assetIdsBeingResolved.add(contentId)
      })
    },
    removeAssetBeingResolved: (contentId) => {
      set((state) => {
        state.assetIdsBeingResolved.delete(contentId)
      })
    },
  }),
})
