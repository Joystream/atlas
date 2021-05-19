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
    if (!dataObject?.liaison?.isActive && randomStorageUrl) {
      return createStorageNodeUrl(dataObject.joystreamContentId, randomStorageUrl)
    }
  }

  return { getAssetUrl }
}
