import { useCallback } from 'react'

import { AssetAvailability, DataObject } from '@/api/queries'
import { useStorageProviders } from '@/hooks'
import { createStorageNodeUrl } from '@/utils/asset'

export const useAsset = () => {
  const { getStorageProvider } = useStorageProviders()

  const getAssetUrl = useCallback(
    (availability?: AssetAvailability, assetUrls?: string[], dataObject?: DataObject | null) => {
      if (availability !== AssetAvailability.Accepted) {
        return
      }
      if (assetUrls?.length) {
        return assetUrls[0]
      }
      if (!dataObject?.joystreamContentId) {
        return
      }
      if (dataObject?.liaison?.isActive && dataObject?.liaison?.metadata) {
        return createStorageNodeUrl(dataObject.joystreamContentId, dataObject?.liaison?.metadata)
      }

      const storageProvider = getStorageProvider()
      if (storageProvider?.url) {
        return createStorageNodeUrl(dataObject.joystreamContentId, storageProvider.url)
      }
    },
    [getStorageProvider]
  )

  return { getAssetUrl }
}
