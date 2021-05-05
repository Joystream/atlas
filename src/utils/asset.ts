import { AssetAvailability, DataObject } from '@/api/queries'
import { STORAGE_URL_PATH } from '@/config/urls'

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
    return createStorageNodeUrl(dataObject.joystreamContentId, dataObject?.liaison?.metadata)
  }
}

const joinUrlFragments = (...fragments: string[]) => {
  // remove trailing/leading slashes
  const strippedFragments = fragments.map((f) => f.replace(/^\/|\/$/, ''))
  return strippedFragments.join('/')
}

export const createStorageNodeUrl = (contentId: string, storageMetadataUrl: string) =>
  joinUrlFragments(storageMetadataUrl, STORAGE_URL_PATH, contentId)
