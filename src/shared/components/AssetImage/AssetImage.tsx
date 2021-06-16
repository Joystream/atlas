import React, { ReactElement, useEffect, cloneElement, useState, useMemo } from 'react'

import { AllChannelFieldsFragment, AssetAvailability, VideoFieldsFragment } from '@/api/queries'
import { useStorageProviders } from '@/hooks'
import { createStorageNodeUrl } from '@/utils/asset'

import { ImageType } from './constants'

type AssetImageProps = { component: ReactElement; isImg?: boolean } & (
  | { entity?: VideoFieldsFragment | null; imageType?: ImageType.THUMBNAIL }
  | { entity?: Partial<AllChannelFieldsFragment> | null; imageType: ImageType.COVER | ImageType.AVATAR }
)

const AssetImage = ({ entity, component, imageType, isImg }: AssetImageProps) => {
  const [assetUrl, setAssetUrl] = useState<string | undefined>(undefined)
  const { getStorageProvider } = useStorageProviders()
  const assetData = useMemo(() => {
    if (entity && entity.__typename === 'Channel') {
      return {
        availability: imageType === ImageType.COVER ? entity.coverPhotoAvailability : entity.avatarPhotoAvailability,
        urls: imageType === ImageType.COVER ? entity.avatarPhotoUrls : entity.coverPhotoUrls,
        dataObject: imageType === ImageType.COVER ? entity.coverPhotoDataObject : entity.avatarPhotoDataObject,
      }
    }
    if (entity && entity.__typename === 'Video') {
      return {
        availability: entity.thumbnailPhotoAvailability,
        urls: entity.thumbnailPhotoUrls,
        dataObject: entity.thumbnailPhotoDataObject,
      }
    }
    return null
  }, [entity, imageType])

  useEffect(() => {
    if (!assetUrl && assetData) {
      if (assetData.availability !== AssetAvailability.Accepted) {
        return
      }
      if (assetData.urls?.length) {
        setAssetUrl(assetData.urls[0])
      }
      if (assetData.dataObject?.liaison?.isActive && assetData.dataObject?.liaison?.metadata) {
        setAssetUrl(
          createStorageNodeUrl(assetData.dataObject.joystreamContentId, assetData.dataObject?.liaison?.metadata)
        )
      }

      const randomStorageUrl = getStorageProvider()
      if (randomStorageUrl && assetData.dataObject) {
        setAssetUrl(createStorageNodeUrl(assetData.dataObject.joystreamContentId, randomStorageUrl.url))
      }
    }
  }, [assetUrl, assetData, getStorageProvider])

  return cloneElement(component, { [isImg ? 'src' : 'assetUrl']: assetUrl })
}

export default AssetImage
