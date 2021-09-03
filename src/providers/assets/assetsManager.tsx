import { shuffle } from 'lodash-es'
import React, { useEffect } from 'react'

import { ASSET_RESPONSE_TIMEOUT } from '@/config/assets'
import { ResolvedAssetDetails } from '@/types/assets'
import { AssetLogger, ConsoleLogger, SentryLogger } from '@/utils/logs'
import { TimeoutError, withTimeout } from '@/utils/misc'

import { getAssetUrl, testAssetDownload } from './helpers'
import { useAssetStore } from './store'
import { AssetType } from './types'

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
      const storageProviders = await getStorageProviders()
      const shuffledStorageProviders = shuffle(storageProviders)
      const storageProvidersWithoutLiaison = shuffledStorageProviders.filter(
        (provider) => provider.id !== resolutionData.dataObject?.liaison?.id
      )
      const liaison = resolutionData.dataObject?.liaison
      const liaisonActive = liaison?.isActive && !!liaison.metadata?.match(/^https?/)
      const storageProvidersToTry = [...(liaison && liaisonActive ? [liaison] : []), ...storageProvidersWithoutLiaison]
      for (const storageProvider of storageProvidersToTry) {
        const assetUrl = getAssetUrl(resolutionData, storageProvider.metadata ?? '')
        if (!assetUrl) {
          ConsoleLogger.warn('Unable to create asset url', resolutionData)
          addAsset(contentId, {})
          removePendingAsset(contentId)
          removeAssetBeingResolved(contentId)
          return
        }

        const assetTestPromise = testAssetDownload(assetUrl, resolutionData.assetType)

        const assetDetails: ResolvedAssetDetails = {
          contentId,
          storageProviderId: storageProvider.workerId,
          storageProviderUrl: storageProvider.metadata,
          assetType: resolutionData.assetType,
          assetUrl,
        }

        assetTestPromise
          .then((responseTime) => {
            if (resolutionData.assetType === AssetType.MEDIA) {
              // we're currently skipping monitoring video files as it's hard to measure their performance
              // image assets are easy to measure but videos vary in length and size
              // we will be able to handle that once we can access more detailed response timing
              return
            }

            // if response takes <20ms assume it's coming from cache
            // we shouldn't need that once we can do detailed timing, then we can check directly
            if (responseTime > 20) {
              AssetLogger.assetResponseMetric(assetDetails, responseTime)
            }
          })
          .catch(() => {
            AssetLogger.assetError(assetDetails)
            ConsoleLogger.error('Failed to load asset', assetDetails)
          })
        const assetTestPromiseWithTimeout = withTimeout(assetTestPromise, ASSET_RESPONSE_TIMEOUT)

        try {
          await assetTestPromiseWithTimeout
          addAsset(contentId, { url: assetUrl })
          removePendingAsset(contentId)
          removeAssetBeingResolved(contentId)
          return
        } catch (e) {
          // ignore anything else than TimeoutError as it will be handled by assetTestPromise.catch
          if (e instanceof TimeoutError) {
            AssetLogger.assetTimeout(assetDetails)
            ConsoleLogger.warn('Asset load timed out', assetDetails)
          }
        }
      }

      SentryLogger.error('No storage provider was able to provide asset', 'AssetsManager', null, {
        asset: {
          contentId,
          type: resolutionData.assetType,
          storageProviderIds: storageProvidersToTry.map((sp) => sp.workerId),
          storageProviderUrls: storageProvidersToTry.map((sp) => sp.metadata),
        },
      })
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
