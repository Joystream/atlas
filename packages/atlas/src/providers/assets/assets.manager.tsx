import BN from 'bn.js'
import { FC, useEffect } from 'react'

import { StorageDataObjectFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { atlasConfig } from '@/config'
import { BUILD_ENV } from '@/config/env'
import { useUserLocationStore } from '@/providers/userLocation'
import { joinUrlFragments } from '@/utils/asset'
import { AssetLogger, ConsoleLogger, DataObjectResponseMetric, DistributorEventEntry, SentryLogger } from '@/utils/logs'
import { TimeoutError, withTimeout } from '@/utils/misc'

import { testAssetDownload } from './assets.helpers'
import { useDistributionOperators, useOperatorsContext } from './assets.provider'
import { useAssetStore } from './assets.store'
import { OperatorInfo } from './assets.types'

export const AssetsManager: FC = () => {
  const { tryRefetchDistributionOperators } = useOperatorsContext()
  const { getAllDistributionOperatorsForBags } = useDistributionOperators()
  const pendingAssets = useAssetStore((state) => state.pendingAssets)
  const assetIdsBeingResolved = useAssetStore((state) => state.assetIdsBeingResolved)
  const { addAsset, addAssetBeingResolved, removeAssetBeingResolved, removePendingAsset } = useAssetStore(
    (state) => state.actions
  )
  const { coordinates } = useUserLocationStore()

  // listen to changes in list of assets pending resolution and resolve them
  useEffect(() => {
    const provideDistributorsForBags = async () => {
      const filteredAssetsArray = Object.entries(pendingAssets).filter(([_, value]) => {
        if (assetIdsBeingResolved.has(value.id)) {
          return false
        }
        if (!value.isAccepted) {
          addAsset(value.id, { url: null })
          removePendingAsset(value.id)
          return false
        }
        return true
      })

      const filteredAssets = Object.fromEntries(filteredAssetsArray)
      const bagIds = [...new Set(Object.values(filteredAssets).map((asset) => asset.storageBag.id))]
      const distributionOperatorsMapping = await getAllDistributionOperatorsForBags(bagIds)
      if (!distributionOperatorsMapping) return

      Object.values(filteredAssets).map(async (dataObject) => {
        const sortedDistributionOperators = sortDistributionOperators(
          distributionOperatorsMapping[dataObject.storageBag.id],
          !coordinates ? dataObject : undefined
        )

        for (const distributionOperator of sortedDistributionOperators) {
          const assetUrl = createDistributionOperatorDataObjectUrl(distributionOperator, dataObject)
          if (pendingAssets[dataObject.id].skipAssetTest) {
            addAsset(dataObject.id, { url: assetUrl })
            removePendingAsset(dataObject.id)
            removeAssetBeingResolved(dataObject.id)
            return
          }
          const assetTestPromise = testAssetDownload(assetUrl, dataObject)
          const assetTestPromiseWithTimeout = withTimeout(assetTestPromise, atlasConfig.storage.assetResponseTimeout)

          const eventEntry: DistributorEventEntry = {
            distributorId: distributionOperator.id,
            distributorUrl: distributionOperator.endpoint,
            dataObjectId: dataObject.id,
            dataObjectType: dataObject.type?.__typename,
          }

          try {
            await assetTestPromiseWithTimeout
            addAsset(dataObject.id, { url: assetUrl })
            removePendingAsset(dataObject.id)
            removeAssetBeingResolved(dataObject.id)
            logDistributorPerformance(assetUrl, eventEntry)
            return
          } catch (err) {
            if (err instanceof TimeoutError) {
              AssetLogger.logDistributorResponseTimeout(eventEntry)
              ConsoleLogger.warn(`Distributor didn't respond in ${atlasConfig.storage.assetResponseTimeout} seconds`, {
                dataObject,
                distributionOperator,
              })
            } else {
              AssetLogger.logDistributorError(eventEntry)
              SentryLogger.error('Error during asset download test', 'AssetsManager', err, {
                asset: { dataObject, distributionOperator },
              })
            }
          }
        }
        // once the asset couldn't be resolved, set URL to null, which means that only the default image placeholder will be shown
        addAsset(dataObject.id, { url: null })
        removePendingAsset(dataObject.id)
        removeAssetBeingResolved(dataObject.id)
        SentryLogger.error('None of the distributors provided the asset', 'AssetsManager', null, {
          asset: { dataObject, sortedDistributionOperators },
        })
      })
    }
    provideDistributorsForBags()
  }, [
    addAsset,
    addAssetBeingResolved,
    assetIdsBeingResolved,
    coordinates,
    getAllDistributionOperatorsForBags,
    pendingAssets,
    removeAssetBeingResolved,
    removePendingAsset,
    tryRefetchDistributionOperators,
  ])

  return null
}

// if user coordinates are known, sort distributors by geographical distance
// otherwise use semi-random fallback
const sortDistributionOperators = (
  distributionOperators: OperatorInfo[],
  dataObject?: StorageDataObjectFieldsFragment
): OperatorInfo[] => {
  if (dataObject) {
    const dataObjectIdBn = new BN(dataObject.id)
    const distributionOperatorsCountBn = new BN(distributionOperators.length)
    const firstDistributorIndex = dataObjectIdBn.mod(distributionOperatorsCountBn).toNumber()
    return [
      ...distributionOperators.slice(firstDistributorIndex),
      ...distributionOperators.slice(0, firstDistributorIndex),
    ]
  }
  return distributionOperators.sort((a, b) => {
    if (!b.distance) {
      return -1
    }
    if (!a.distance) {
      return 1
    }
    return a.distance - b.distance
  })
}

const createDistributionOperatorDataObjectUrl = (
  distributionOperator: OperatorInfo,
  dataObject: StorageDataObjectFieldsFragment
) => {
  return joinUrlFragments(distributionOperator.endpoint, atlasConfig.storage.assetPath, dataObject.id)
}

const logDistributorPerformance = async (assetUrl: string, eventEntry: DistributorEventEntry) => {
  if (!AssetLogger.isEnabled) return

  // delay execution for 1s to make sure performance entries get populated
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const performanceEntries = window.performance.getEntriesByName(assetUrl)
  const performanceEntry = performanceEntries[0] as PerformanceResourceTiming

  if (!performanceEntry && BUILD_ENV === 'production') {
    ConsoleLogger.debug('Performance entry not found', { assetUrl })
    return
  }

  const { decodedBodySize, transferSize, fetchStart, responseStart, responseEnd } = performanceEntry

  if (decodedBodySize / transferSize > 5) {
    // if resource size is considerably larger than over-the-wire transfer size, we can assume we got the result from the cache
    return
  }

  const metric: DataObjectResponseMetric = {
    initialResponseTime: responseStart - fetchStart,
    fullResponseTime: responseEnd - fetchStart,
  }

  AssetLogger.logDistributorResponseTime(eventEntry, metric)
}
