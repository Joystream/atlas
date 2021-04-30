import { AssetAvailability, DataObject } from '@/api/queries'
import { STORAGE_NODE_URL } from '@/config/urls'

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
  if (dataObject?.joystreamContentId) {
    const url = new URL(dataObject.joystreamContentId, STORAGE_NODE_URL)
    return url.href
  }
}
