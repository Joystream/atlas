import { shuffle } from 'lodash'
import React, { useEffect } from 'react'

import { Logger } from '@/utils/logger'

import { getAssetUrl, testAssetDownload } from './helpers'
import { useAssetStore } from './store'

import { useStorageProviders } from '../storageProviders'

export const AssetsManager: React.FC = () => {
  const { getStorageProviders, getRandomStorageProvider } = useStorageProviders()
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
      const allStorageProviders = shuffle(getStorageProviders() || [])
      const storageProvidersWithoutLiaison = allStorageProviders.filter(
        (provider) => provider.id !== resolutionData.dataObject?.liaison?.id
      )
      const storageProvidersToTry = [
        ...(resolutionData.dataObject?.liaison ? [resolutionData.dataObject.liaison] : []),
        ...storageProvidersWithoutLiaison,
      ]
      for (const storageProvider of storageProvidersToTry) {
        const assetUrl = getAssetUrl(resolutionData, storageProvider.metadata ?? '')
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
          return
        } catch (e) {
          Logger.error(`Failed to load ${resolutionData.assetType}`, { contentId, assetUrl })
        }
      }
      Logger.error(`No storage provider was able to provide asset`, { contentId })
    })
  }, [
    addAsset,
    addAssetBeingResolved,
    assetIdsBeingResolved,
    getStorageProviders,
    getRandomStorageProvider,
    pendingAssets,
    removeAssetBeingResolved,
    removePendingAsset,
  ])

  return null
}
