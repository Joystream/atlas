import { AssetAvailability, DataObject } from '@/api/queries'

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
    const url = new URL(dataObject.joystreamContentId, dataObject?.liaison?.metadata + '/asset/v0/')
    return url.href
  }
}
