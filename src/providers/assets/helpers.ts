import {
  AllChannelFieldsFragment,
  AssetAvailability,
  BasicChannelFieldsFragment,
  BasicVideoFieldsFragment,
  VideoFieldsFragment,
} from '@/api/queries'
import { createStorageNodeUrl } from '@/utils/asset'

import { AssetResolutionData, AssetType } from './types'

export const testAssetDownload = (url: string, type: AssetType): Promise<number> => {
  return new Promise((_resolve, _reject) => {
    let img: HTMLImageElement | null = null
    let video: HTMLVideoElement | null = null

    const cleanup = () => {
      if (img) {
        img.removeEventListener('error', reject)
        img.removeEventListener('load', resolve)
        img.remove()
        img = null
      }
      if (video) {
        video.removeEventListener('error', reject)
        video.removeEventListener('loadedmetadata', resolve)
        video.removeEventListener('loadeddata', resolve)
        video.removeEventListener('canplay', resolve)
        video.removeEventListener('progress', resolve)
        video.remove()
        video = null
      }
    }

    const resolve = () => {
      cleanup()

      const performanceEntries = performance.getEntriesByName(url)
      if (performanceEntries.length !== 1) {
        _resolve(0)
        return
      }
      _resolve(performanceEntries[0].duration)
    }

    const reject = () => {
      cleanup()
      _reject()
    }

    if ([AssetType.COVER, AssetType.THUMBNAIL, AssetType.AVATAR].includes(type)) {
      img = new Image()
      img.addEventListener('error', reject)
      img.addEventListener('load', resolve)
      img.src = url
    } else {
      video = document.createElement('video')
      video.addEventListener('error', reject)
      video.addEventListener('loadedmetadata', resolve)
      video.addEventListener('loadeddata', resolve)
      video.addEventListener('canplay', resolve)
      video.addEventListener('progress', resolve)
      video.src = url
    }
  })
}
export const readAssetData = (
  entity:
    | VideoFieldsFragment
    | BasicVideoFieldsFragment
    | AllChannelFieldsFragment
    | BasicChannelFieldsFragment
    | null
    | undefined,
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
      availability:
        assetType === AssetType.MEDIA
          ? (entity as VideoFieldsFragment).mediaAvailability
          : entity.thumbnailPhotoAvailability,
      urls: assetType === AssetType.MEDIA ? (entity as VideoFieldsFragment).mediaUrls : entity.thumbnailPhotoUrls,
      dataObject:
        assetType === AssetType.MEDIA
          ? (entity as VideoFieldsFragment).mediaDataObject
          : entity.thumbnailPhotoDataObject,
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
