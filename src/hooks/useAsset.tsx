import { useRandomStorageProviderUrl } from '@/api/hooks'
import { AssetAvailability, DataObject } from '@/api/queries'
import { createStorageNodeUrl } from '@/utils/asset'

export const useAsset = () => {
  const randomStorageUrl = useRandomStorageProviderUrl()

  const getAssetUrl = (availability?: AssetAvailability, assetUrls?: string[], dataObject?: DataObject | null) => {
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
    if (randomStorageUrl) {
      return createStorageNodeUrl(dataObject.joystreamContentId, randomStorageUrl)
    }
    console.error('No storage provider available to serve asset')
  }

  return { getAssetUrl }
}
