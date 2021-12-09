import BN from 'bn.js'
import React, { useEffect } from 'react'

import { StorageDataObjectFieldsFragment } from '@/api/queries'
import { ASSET_RESPONSE_TIMEOUT } from '@/config/assets'
import { DISTRIBUTOR_ASSET_PATH } from '@/config/urls'
import { useDistributors } from '@/providers/distributors'
import { DistributorInfo } from '@/types/storage'
import { joinUrlFragments } from '@/utils/asset'
import { AssetLogger, ConsoleLogger, DistributorEventEntry, SentryLogger } from '@/utils/logs'
import { TimeoutError, withTimeout } from '@/utils/misc'

import { testAssetDownload } from './helpers'
import { useAssetStore } from './store'

export const AssetsManager: React.FC = () => {
  const { getAllDistributors } = useDistributors()
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

      const distributors = await getAllDistributors(dataObject.storageBag.id)
      if (!distributors) {
        // TODO: potentially try to fetch distributors again
        SentryLogger.error('No distributor was found for the storage bag', 'AssetsManager', null, {
          asset: {
            id: dataObject.id,
            storageBagId: dataObject.storageBag.id,
            type: dataObject.type.__typename,
          },
        })
        return
      }

      const sortedDistributors = sortDistributors(distributors, dataObject)

      for (const distributor of sortedDistributors) {
        const assetUrl = createDistributorDataObjectUrl(distributor, dataObject)

        const assetTestPromise = testAssetDownload(assetUrl, dataObject)
        const assetTestPromiseWithTimeout = withTimeout(assetTestPromise, ASSET_RESPONSE_TIMEOUT)
        // TODO: test and enable back
        // logDistributorPerformance(assetTestPromise, distributor, dataObject)

        try {
          await assetTestPromiseWithTimeout
          addAsset(dataObject.id, { url: assetUrl })
          removePendingAsset(dataObject.id)
          removeAssetBeingResolved(dataObject.id)
          return
        } catch (err) {
          if (err instanceof TimeoutError) {
            // AssetLogger.assetTimeout(assetDetails)
            ConsoleLogger.warn(`Distributor didn't respond in ${ASSET_RESPONSE_TIMEOUT} seconds`, {
              dataObject,
              distributor,
            })
          } else {
            SentryLogger.error('Error during asset download test', 'AssetsManager', err, {
              asset: { dataObject, distributor },
            })
          }
        }
      }

      SentryLogger.error('None of the distributors provided the asset', 'AssetsManager', null, {
        asset: { dataObject, sortedDistributors },
      })
    })
  }, [
    addAsset,
    addAssetBeingResolved,
    assetIdsBeingResolved,
    getAllDistributors,
    pendingAssets,
    removeAssetBeingResolved,
    removePendingAsset,
  ])

  return null
}

// deterministically sort distributors for a given dataObject
// this is important for caching, if we pick the distributor at random, clients will end up caching [distributors.length] copies of each asset (all have unique URL)
// TODO: geographical locations into the account, to offer a distributor physically closest to the client, this should ensure best response times
const sortDistributors = (
  distributors: DistributorInfo[],
  dataObject: StorageDataObjectFieldsFragment
): DistributorInfo[] => {
  const dataObjectIdBn = new BN(dataObject.id)
  const distributorsCountBn = new BN(distributors.length)
  const firstDistributorIndex = dataObjectIdBn.mod(distributorsCountBn).toNumber()
  return [...distributors.slice(firstDistributorIndex), ...distributors.slice(0, firstDistributorIndex)]
}

const createDistributorDataObjectUrl = (distributor: DistributorInfo, dataObject: StorageDataObjectFieldsFragment) => {
  return joinUrlFragments(distributor.endpoint, DISTRIBUTOR_ASSET_PATH, dataObject.id)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logDistributorPerformance = (
  downloadTestPromise: Promise<number>,
  distributor: DistributorInfo,
  dataObject: StorageDataObjectFieldsFragment
) => {
  const eventEntry: DistributorEventEntry = {
    distributorId: distributor.id,
    distributorUrl: distributor.endpoint,
    dataObjectId: dataObject.id,
    dataObjectType: dataObject.type.__typename,
  }

  // TODO: enable detailed metrics with Resource Timing API https://developer.mozilla.org/en-US/docs/Web/API/Resource_Timing_API/Using_the_Resource_Timing_API#coping_with_cors
  downloadTestPromise
    .then((responseTime) => {
      if (dataObject.type.__typename === 'DataObjectTypeVideoMedia') {
        // we're currently skipping monitoring video files as it's hard to measure their performance
        // image assets are easy to measure but videos vary in length and size
        // we will be able to handle that once we can access more detailed response timing
        return
      }

      // if response takes <20ms assume it's coming from cache
      // we shouldn't need that once we can do detailed timing, then we can check directly
      if (responseTime > 20) {
        AssetLogger.assetResponseMetric(eventEntry, responseTime)
      }
    })
    .catch((err) => {
      AssetLogger.assetError(eventEntry)
      throw err
    })
}
