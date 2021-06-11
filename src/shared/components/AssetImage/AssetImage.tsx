import React, { useEffect, ReactElement, cloneElement, useState } from 'react'

import { useRandomStorageProviderUrl } from '@/api/hooks'
import { AssetAvailability, DataObject } from '@/api/queries'
import { createStorageNodeUrl } from '@/utils/asset'

interface AssetImageProps {
  isBackgroundImage?: boolean
  assetData: {
    availability?: AssetAvailability
    assetUrls?: string[]
    dataObject?: DataObject | null
  }
  component: ReactElement
}

const AssetImage = ({
  isBackgroundImage,
  assetData: { availability, assetUrls, dataObject },
  component,
}: AssetImageProps) => {
  const [assetUrl, setAssetUrl] = useState<string | null>(null)
  const { getRandomStorageProviderUrl } = useRandomStorageProviderUrl()

  useEffect(() => {
    if (!assetUrl) {
      if (availability !== AssetAvailability.Accepted) {
        return
      }
      if (assetUrls?.length) {
        setAssetUrl(assetUrls[0])
      }
      if (dataObject?.liaison?.isActive && dataObject?.liaison?.metadata) {
        setAssetUrl(createStorageNodeUrl(dataObject.joystreamContentId, dataObject?.liaison?.metadata))
      }

      const randomStorageUrl = getRandomStorageProviderUrl()
      if (randomStorageUrl && dataObject) {
        setAssetUrl(createStorageNodeUrl(dataObject.joystreamContentId, randomStorageUrl))
      }
    }
  }, [assetUrl, assetUrls, availability, dataObject, getRandomStorageProviderUrl])

  return cloneElement(component, { [isBackgroundImage ? '$src' : 'src']: assetUrl })
}

export default AssetImage
