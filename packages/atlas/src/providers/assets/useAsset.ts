import { useEffect } from 'react'

import { StorageDataObjectFieldsFragment } from '@/api/queries'

import { useAssetStore } from './store'

export const useAsset = (dataObject: StorageDataObjectFieldsFragment | null | undefined) => {
  const contentId = dataObject?.id ?? null
  const asset = useAssetStore((state) => (contentId ? state.assets[contentId] : null))
  const pendingAsset = useAssetStore((state) => (contentId ? state.pendingAssets[contentId] : null))
  const addPendingAsset = useAssetStore((state) => state.actions.addPendingAsset)

  useEffect(() => {
    if (asset || pendingAsset || !contentId || !dataObject) return

    addPendingAsset(contentId, dataObject)
  }, [addPendingAsset, asset, dataObject, contentId, pendingAsset])

  return { url: asset?.url, isLoadingAsset: !!dataObject && !!contentId && !asset }
}

export const useRawAsset = (contentId: string | null) => {
  return useAssetStore((state) => (contentId ? state.assets[contentId] : null))
}

export const useRawAssetResolver = () => {
  return (contentId: string | null) => (contentId ? useAssetStore.getState().assets[contentId] : null)
}
