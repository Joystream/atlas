import { isEqual } from 'lodash'
import { useEffect, useState } from 'react'

import { useStorageProviders } from '@/providers'
import { Logger } from '@/utils/logger'

import { getAssetUrl, readAssetData, testAssetDownload } from './helpers'
import { AssetData, UseAsset } from './types'

export const useAsset: UseAsset = ({ entity, assetType }, opts = {}) => {
  const { getStorageProvider } = useStorageProviders()
  const [error, setError] = useState<ErrorEvent | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [url, setUrl] = useState<string | undefined>(undefined)
  const [cachedAssetData, setCachedAssetData] = useState<AssetData | null | undefined>(undefined)

  const assetData = entity ? readAssetData(entity, assetType) : null
  const assetDataNotChanged = entity ? isEqual(assetData, cachedAssetData) : false

  useEffect(() => {
    if (!entity || assetDataNotChanged || opts.skip) {
      // only run if asset data changed
      return
    }
    setCachedAssetData(assetData)
    setUrl(undefined)
    setIsLoading(true)

    if (!assetData) {
      Logger.warn('Unable to read asset data from entity')
      return
    }
    const assetUrl = getAssetUrl(assetData, getStorageProvider()?.url)
    if (assetUrl === null) {
      Logger.warn('Unable to create asset url', assetData)
      return
    } else if (!assetUrl) {
      return
    }
    setUrl(assetUrl)

    const testAsset = async () => {
      setIsLoading(true)
      setError(null)

      try {
        await testAssetDownload(assetUrl, assetType)
      } catch (e) {
        setError(e)
        Logger.error(`Failed to load ${assetType}`, e)
      } finally {
        setIsLoading(false)
      }
    }

    testAsset()
  }, [assetType, assetData, assetDataNotChanged, entity, getStorageProvider, opts.skip])

  return { url: assetDataNotChanged ? url : undefined, error, isLoading }
}
