import { Asset } from '@/api/queries'
import { STORAGE_NODE_URL } from '@/config/urls'

export const getUrlFromAsset = (asset?: Asset | null) => {
  if (!asset) return
  if (asset.__typename === 'AssetStorage') {
    const id = asset.uploadStatus.dataObject.joystreamContentId
    const url = new URL(id, STORAGE_NODE_URL)
    return url.href
  }
  if (asset.__typename === 'AssetUrl') {
    return asset.url
  }
}
