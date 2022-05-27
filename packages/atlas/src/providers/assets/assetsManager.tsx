import BN from 'bn.js'
import { FC, useEffect } from 'react'

import { StorageDataObjectFieldsFragment } from '@/api/queries'
import { ASSET_RESPONSE_TIMEOUT } from '@/config/assets'
import { BUILD_ENV } from '@/config/envs'
import { DISTRIBUTOR_ASSET_PATH } from '@/config/urls'
import { joinUrlFragments } from '@/utils/asset'
import { AssetLogger, ConsoleLogger, DataObjectResponseMetric, DistributorEventEntry, SentryLogger } from '@/utils/logs'
import { TimeoutError, withTimeout } from '@/utils/misc'

import { testAssetDownload } from './helpers'
import { useDistributionOperators, useOperatorsContext } from './operatorsProvider'
import { useAssetStore } from './store'
import { OperatorInfo } from './types'

export const AssetsManager: FC = () => {
  const { tryRefetchDistributionOperators } = useOperatorsContext()
  const { getAllDistributionOperatorsForBag } = useDistributionOperators()
  const pendingAssets = useAssetStore((state) => state.pendingAssets)
  const assetIdsBeingResolved = useAssetStore((state) => state.assetIdsBeingResolved)
  const { addAsset, addAssetBeingResolved, removeAssetBeingResolved, removePendingAsset } = useAssetStore(
    (state) => state.actions
  )

  useEffect(() => {
    Object.values(pendingAssets).forEach(async (dataObject) => {
      // make sure we handle each asset only once
      if (assetIdsBeingResolved.has(dataObject.id)) {
        return
      }
      addAssetBeingResolved(dataObject.id)

      const distributionOperators = await getAllDistributionOperatorsForBag(dataObject.storageBag.id)
      if (!distributionOperators) {
        const refetching = await tryRefetchDistributionOperators()
        if (refetching) {
          // remove asset from being resolved list, so it can enter resolution again
          removeAssetBeingResolved(dataObject.id)
          return
        }

        SentryLogger.error('No distribution operator was found for the storage bag', 'AssetsManager', null, {
          asset: {
            id: dataObject.id,
            storageBagId: dataObject.storageBag.id,
            type: dataObject.type.__typename,
          },
        })
        return
      }

      const sortedDistributionOperators = sortDistributionOperators(distributionOperators, dataObject)

      for (const distributionOperator of sortedDistributionOperators) {
        const assetUrl = createDistributionOperatorDataObjectUrl(distributionOperator, dataObject)

        const assetTestPromise = testAssetDownload(assetUrl, dataObject)
        const assetTestPromiseWithTimeout = withTimeout(assetTestPromise, ASSET_RESPONSE_TIMEOUT)

        const eventEntry: DistributorEventEntry = {
          distributorId: distributionOperator.id,
          distributorUrl: distributionOperator.endpoint,
          dataObjectId: dataObject.id,
          dataObjectType: dataObject.type.__typename,
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
            ConsoleLogger.warn(`Distributor didn't respond in ${ASSET_RESPONSE_TIMEOUT} seconds`, {
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

      SentryLogger.error('None of the distributors provided the asset', 'AssetsManager', null, {
        asset: { dataObject, sortedDistributionOperators },
      })
    })
  }, [
    addAsset,
    addAssetBeingResolved,
    assetIdsBeingResolved,
    getAllDistributionOperatorsForBag,
    pendingAssets,
    removeAssetBeingResolved,
    removePendingAsset,
    tryRefetchDistributionOperators,
  ])

  return null
}

// deterministically sort distributors for a given dataObject
// this is important for caching, if we pick the distributor at random, clients will end up caching [distributors.length] copies of each asset (all have unique URL)
// TODO: take geographical locations into the account, to offer a distributor physically closest to the client, this should ensure best response times
const sortDistributionOperators = (
  distributionOperators: OperatorInfo[],
  dataObject: StorageDataObjectFieldsFragment
): OperatorInfo[] => {
  const dataObjectIdBn = new BN(dataObject.id)
  const distributionOperatorsCountBn = new BN(distributionOperators.length)
  const firstDistributorIndex = dataObjectIdBn.mod(distributionOperatorsCountBn).toNumber()
  return [
    ...distributionOperators.slice(firstDistributorIndex),
    ...distributionOperators.slice(0, firstDistributorIndex),
  ]
}

const createDistributionOperatorDataObjectUrl = (
  distributionOperator: OperatorInfo,
  dataObject: StorageDataObjectFieldsFragment
) => {
  return joinUrlFragments(distributionOperator.endpoint, DISTRIBUTOR_ASSET_PATH, dataObject.id)
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
