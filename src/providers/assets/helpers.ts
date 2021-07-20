import {
  AllChannelFieldsFragment,
  AssetAvailability,
  BasicChannelFieldsFragment,
  VideoFieldsFragment,
} from '@/api/queries'
import { ASSET_RESPONSE_TIMEOUT } from '@/config/assets'
import { createStorageNodeUrl } from '@/utils/asset'
import { withTimeout } from '@/utils/misc'

import { AssetResolutionData, AssetType } from './types'

export const testAssetDownload = (url: string, type: AssetType) => {
  const testPromise = new Promise((resolve, reject) => {
    if ([AssetType.COVER, AssetType.THUMBNAIL, AssetType.AVATAR].includes(type)) {
      const img = new Image()
      img.addEventListener('error', reject)
      img.addEventListener('load', resolve)
      img.src = url
    } else {
      const video = document.createElement('video')
      video.addEventListener('error', reject)
      video.addEventListener('loadstart', resolve)
      video.src = url
    }
  })
  return withTimeout(testPromise, ASSET_RESPONSE_TIMEOUT)
}
export const readAssetData = (
  entity: VideoFieldsFragment | AllChannelFieldsFragment | BasicChannelFieldsFragment | null | undefined,
  assetType: AssetType
): AssetResolutionData | null => {
  if (entity?.__typename === 'Channel') {
    return {
      availability:
        assetType === AssetType.COVER
          ? (entity as AllChannelFieldsFragment).coverPhotoAvailability
          : entity.avatarPhotoAvailability,
      urls:
        assetType === AssetType.COVER ? (entity as AllChannelFieldsFragment).coverPhotoUrls : entity.avatarPhotoUrls,
      dataObject:
        assetType === AssetType.COVER
          ? (entity as AllChannelFieldsFragment).coverPhotoDataObject
          : entity.avatarPhotoDataObject,
      assetType,
    }
  } else if (entity?.__typename === 'Video') {
    return {
      availability: assetType === AssetType.MEDIA ? entity.mediaAvailability : entity.thumbnailPhotoAvailability,
      urls: assetType === AssetType.MEDIA ? entity.mediaUrls : entity.thumbnailPhotoUrls,
      dataObject: assetType === AssetType.MEDIA ? entity.mediaDataObject : entity.thumbnailPhotoDataObject,
      assetType,
    }
  }
  return null
}
export const getAssetUrl = (assetData: AssetResolutionData, storageProviderUrl: string): string | null | void => {
  if (assetData.availability !== AssetAvailability.Accepted) {
    return
  }
  if (!assetData.dataObject?.joystreamContentId) {
    if (assetData.urls?.length) {
      return assetData.urls[0]
    }
    return
  }

  return createStorageNodeUrl(assetData.dataObject.joystreamContentId, storageProviderUrl)
}
