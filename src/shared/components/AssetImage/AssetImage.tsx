import React, { ReactElement, useEffect, cloneElement, useState, useMemo } from 'react'

import { AllChannelFieldsFragment, AssetAvailability, VideoFieldsFragment } from '@/api/queries'
import { useStorageProviders } from '@/hooks'
import { createStorageNodeUrl } from '@/utils/asset'

type AssetImageProps = { entity?: AllChannelFieldsFragment | VideoFieldsFragment | null; component: ReactElement }

const AssetImage = ({ entity, component }: AssetImageProps) => {
  const [assetUrl, setAssetUrl] = useState<string | undefined>(undefined)
  const { getStorageProvider } = useStorageProviders()
  const assetData = useMemo(() => {
    if (entity && entity.__typename === 'Channel') {
      return {
        title: entity.title,
        availability: entity.coverPhotoAvailability || entity.avatarPhotoAvailability,
        urls: entity.avatarPhotoUrls || entity.coverPhotoUrls,
        dataObject: entity.coverPhotoDataObject || entity.avatarPhotoDataObject,
      }
    }
    if (entity && entity.__typename === 'Video') {
      return {
        title: entity.title,
        availability: entity.thumbnailPhotoAvailability,
        urls: entity.thumbnailPhotoUrls,
        dataObject: entity.thumbnailPhotoDataObject,
      }
    }
    return null
  }, [entity])

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

  return cloneElement(component, { assetUrl })
}

export default AssetImage
