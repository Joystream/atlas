import { AssetAvailability, DataObject } from '@/api/queries'
import { STORAGE_NODE_URL } from '@/config/urls'

export const createUrlFromAsset = (
  availability?: AssetAvailability,
  assetUrls?: string[],
  dataObject?: DataObject | null
) => {
  if (!availability) {
    return
  }
  if (availability !== AssetAvailability.Accepted) {
    console.warn('Trying to create URL for non-accepted asset')
    return
  }
  if (dataObject?.joystreamContentId) {
    const url = new URL(dataObject.joystreamContentId, STORAGE_NODE_URL)
    return url.href
  }
  if (assetUrls?.length) {
    return assetUrls[0]
  }
}
