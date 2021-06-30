import { useEffect } from 'react'

import { readAssetData } from './helpers'
import { useAssetStore } from './store'
import { UseAssetDataArgs } from './types'

export const useAsset = ({ entity, assetType }: UseAssetDataArgs) => {
  const assetData = readAssetData(entity, assetType)
  const contentId = assetData?.dataObject?.joystreamContentId ?? null
  const asset = useAssetStore((state) => (contentId ? state.assets[contentId] : null))
  const pendingAsset = useAssetStore((state) => (contentId ? state.pendingAssets[contentId] : null))
  const addPendingAsset = useAssetStore((state) => state.actions.addPendingAsset)

  useEffect(() => {
    if (asset || pendingAsset || !contentId || !assetData) return

    addPendingAsset(contentId, assetData)
  }, [addPendingAsset, asset, assetData, contentId, pendingAsset])

  if (asset) {
    return { url: asset.url }
  }

  return { url: null }
}

export const useRawAsset = (contentId: string | null) => {
  return useAssetStore((state) => (contentId ? state.assets[contentId] : null))
}

export const useRawAssetResolver = () => {
  return (contentId: string | null) => (contentId ? useAssetStore.getState().assets[contentId] : null)
}
