import { AssetAvailability, DataObject } from '@/api/queries'
import { STORAGE_URL_SUFFIX } from '@/config/urls'

export const createUrlFromAsset = (
  availability?: AssetAvailability,
  assetUrls?: string[],
  dataObject?: DataObject | null
) => {
  if (availability !== AssetAvailability.Accepted) {
    return
  }
  if (assetUrls?.length) {
    return assetUrls[0]
  }
  if (dataObject?.joystreamContentId && dataObject?.liaison?.metadata) {
    // dataObject?.liaison?.metadata is a storage node url
    const url = createStorageNodeUrl(dataObject.joystreamContentId, dataObject?.liaison?.metadata)
    return url.href
  }
}

export const createStorageNodeUrl = (contentId: string, storageMetadata: string) =>
  new URL(contentId, storageMetadata + STORAGE_URL_SUFFIX)
