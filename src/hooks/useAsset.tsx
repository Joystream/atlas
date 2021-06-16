import { useCallback, useState } from 'react'

import { AssetAvailability, DataObject } from '@/api/queries'
import { useStorageProviders } from '@/hooks'
import { createStorageNodeUrl } from '@/utils/asset'

type UseAssetData = [
  {
    url?: string
    error: boolean
    isLoading: boolean
  },
  (availability?: AssetAvailability, assetUrls?: string[], dataObject?: DataObject | null) => void
]

export const useAsset = (): UseAssetData => {
  const { getStorageProvider } = useStorageProviders()
  const [error, setError] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [url, setUrl] = useState<string | undefined>(undefined)

  const testImage = (assetUrl: string) => {
    const img = new Image()
    img.addEventListener('error', () => {
      setIsLoading(false)
      setError(true)
    })
    img.addEventListener('load', () => {
      setIsLoading(false)
      setUrl(assetUrl)
    })
    img.src = assetUrl
  }

  const getAssetUrl = useCallback(
    (availability?: AssetAvailability, assetUrls?: string[], dataObject?: DataObject | null) => {
      if (!url && !isLoading) {
        if (availability !== AssetAvailability.Accepted) {
          return
        }
        if (assetUrls?.length) {
          testImage(assetUrls[0])
          return
        }
        if (!dataObject?.joystreamContentId) {
          return
        }
        if (dataObject?.liaison?.isActive && dataObject?.liaison?.metadata) {
          testImage(createStorageNodeUrl(dataObject.joystreamContentId, dataObject?.liaison?.metadata))
          return
        }

        const storageProvider = getStorageProvider()
        if (storageProvider?.url) {
          testImage(createStorageNodeUrl(dataObject.joystreamContentId, storageProvider.url))
          return
        }
      }
    },
    [url, isLoading, getStorageProvider]
  )

  return [{ url, error, isLoading }, getAssetUrl]
}
