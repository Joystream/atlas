import { StorageDataObjectFieldsFragment } from '@/api/queries'
import { createStore } from '@/store'

type ContentId = string
export type ResolvedAsset = {
  url?: string | null
  blob?: File | Blob | null
}

type AssetStoreState = {
  assets: Record<string, ResolvedAsset> // mapping of content ID to resolved assets
  pendingAssets: Record<string, StorageDataObjectFieldsFragment> // list of content IDs pending resolution
  immediatePendingAssets: Record<string, StorageDataObjectFieldsFragment>
  assetIdsBeingResolved: Set<string> // list of content IDs being currently resolved
}

type AssetStoreActions = {
  addAsset: (contentId: string, asset: ResolvedAsset) => void
  addPendingAsset: (
    contentId: ContentId,
    storageDataObject: StorageDataObjectFieldsFragment,
    immediate?: boolean
  ) => void
  removePendingAsset: (contentId: ContentId) => void
  removeImmediatePendingAsset: (contentId: ContentId) => void
  addAssetBeingResolved: (contentId: ContentId) => void
  removeAssetBeingResolved: (contentId: ContentId) => void
}

export const useAssetStore = createStore<AssetStoreState, AssetStoreActions>({
  state: {
    assets: {},
    pendingAssets: {},
    immediatePendingAssets: {},
    assetIdsBeingResolved: new Set(),
  },
  actionsFactory: (set) => ({
    addAsset: (contentId, asset) => {
      set((state) => {
        state.assets[contentId] = asset
      })
    },
    addPendingAsset: (contentId, storageDataObject, immediate) => {
      set((state) => {
        if (immediate) {
          if (state.immediatePendingAssets[contentId]) return
          state.immediatePendingAssets[contentId] = storageDataObject
        } else {
          if (state.pendingAssets[contentId]) return
          state.pendingAssets[contentId] = storageDataObject
        }
      })
    },
    removePendingAsset: (contentId) => {
      set((state) => {
        delete state.pendingAssets[contentId]
      })
    },
    removeImmediatePendingAsset: (contentId) => {
      set((state) => {
        delete state.immediatePendingAssets[contentId]
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
