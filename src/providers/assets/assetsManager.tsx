import React, { useEffect } from 'react'

import { Logger } from '@/utils/logger'

import { getAssetUrl, testAssetDownload } from './helpers'
import { useAssetStore } from './store'

import { useStorageProviders } from '../storageProviders'

export const AssetsManager: React.FC = () => {
  const { getStorageProvider } = useStorageProviders()
  const pendingAssets = useAssetStore((state) => state.pendingAssets)
  const assetIdsBeingResolved = useAssetStore((state) => state.assetIdsBeingResolved)
  const { addAsset, addAssetBeingResolved, removeAssetBeingResolved, removePendingAsset } = useAssetStore(
    (state) => state.actions
  )

  useEffect(() => {
    Object.keys(pendingAssets).forEach(async (contentId) => {
      // make sure we handle this only once
      if (assetIdsBeingResolved.has(contentId)) {
        return
      }
      addAssetBeingResolved(contentId)

      const resolutionData = pendingAssets[contentId]
      const assetUrl = getAssetUrl(resolutionData, getStorageProvider()?.url)
      if (!assetUrl) {
        Logger.warn('Unable to create asset url', resolutionData)
        addAsset(contentId, {})
        return
      }
      try {
        await testAssetDownload(assetUrl, resolutionData.assetType)
        addAsset(contentId, { url: assetUrl })
        removePendingAsset(contentId)
        removeAssetBeingResolved(contentId)
      } catch (e) {
        Logger.error(`Failed to load ${resolutionData.assetType}`, { contentId, assetUrl })
      }
    })
  }, [
    addAsset,
    addAssetBeingResolved,
    assetIdsBeingResolved,
    getStorageProvider,
    pendingAssets,
    removeAssetBeingResolved,
    removePendingAsset,
  ])

  return null
}
