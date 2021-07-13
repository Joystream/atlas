import {
  AllChannelFieldsFragment,
  AssetAvailability,
  BasicChannelFieldsFragment,
  VideoFieldsFragment,
} from '@/api/queries'
import { createStorageNodeUrl } from '@/utils/asset'
import { Logger } from '@/utils/logger'

import { AssetResolutionData, AssetType } from './types'

export const testAssetDownload = (url: string, type: AssetType) => {
  return new Promise((resolve, reject) => {
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
export const getAssetUrl = (
  assetData: AssetResolutionData,
  randomStorageUrl: string | null | undefined
): string | null | void => {
  if (assetData.availability !== AssetAvailability.Accepted) {
    return
  }
  if (!assetData.dataObject?.joystreamContentId) {
    if (assetData.urls?.length) {
      return assetData.urls[0]
    }
    return
  }

  if (assetData.dataObject.liaison?.isActive && assetData.dataObject.liaison.metadata) {
    return createStorageNodeUrl(assetData.dataObject.joystreamContentId, assetData.dataObject.liaison.metadata)
  } else {
    if (randomStorageUrl) {
      return createStorageNodeUrl(assetData.dataObject.joystreamContentId, randomStorageUrl)
    } else {
      Logger.warn('Unable to create asset url', assetData)
      return null
    }
  }
}
