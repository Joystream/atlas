import { AssetAvailability, DataObject } from '@/api/queries'
import { STORAGE_NODE_URL } from '@/config/urls'

export const createUrlFromAsset = (
  availability?: AssetAvailability,
  assetUrl?: string | null,
  dataObject?: DataObject | null
) => {
  if (availability !== AssetAvailability.Accepted) {
    return
  }
  if (dataObject?.joystreamContentId) {
    const url = new URL(dataObject.joystreamContentId, STORAGE_NODE_URL)
    return url.href
  }
  if (assetUrl) {
    return assetUrl
  }
}
