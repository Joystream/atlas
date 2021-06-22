import isEqual from 'lodash/isEqual'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { AllChannelFieldsFragment, AssetAvailability, VideoFieldsFragment } from '@/api/queries'
import { AssetType } from '@/hooks'
import { useStorageProviders } from '@/providers'
import { createStorageNodeUrl } from '@/utils/asset'
import { Logger } from '@/utils/logger'

type UseAssetDataArgs =
  | { entity?: VideoFieldsFragment | null; assetType: AssetType.THUMBNAIL | AssetType.MEDIA }
  | {
      entity?: Partial<AllChannelFieldsFragment> | null
      assetType: AssetType.COVER | AssetType.AVATAR
    }

type UseAssetData = {
  url?: string
  error: ErrorEvent | null
  isLoading?: boolean
}

type UseAsset = ({ entity, assetType }: UseAssetDataArgs) => UseAssetData

export const useAsset: UseAsset = ({ entity, assetType }) => {
  const { getStorageProvider } = useStorageProviders()
  const [error, setError] = useState<ErrorEvent | null>(null)
  const [isLoading, setIsLoading] = useState<boolean | undefined>(undefined)
  const [url, setUrl] = useState<string | undefined>(undefined)
  const cachedAssetData = useRef({})

  useEffect(() => {
    if (error) {
      Logger.error(`Failed to load ${assetType}`, error)
    }
  }, [error, assetType])

  const assetData = useMemo(() => {
    if (entity && entity.__typename === 'Channel') {
      return {
        availability: assetType === AssetType.COVER ? entity.coverPhotoAvailability : entity.avatarPhotoAvailability,
        urls: assetType === AssetType.COVER ? entity.coverPhotoUrls : entity.avatarPhotoUrls,
        dataObject: assetType === AssetType.COVER ? entity.coverPhotoDataObject : entity.avatarPhotoDataObject,
      }
    }
    if (entity && entity.__typename === 'Video') {
      if (assetType === AssetType.MEDIA) {
        return {
          availability: entity.mediaAvailability,
          urls: entity.mediaUrls,
          dataObject: entity.mediaDataObject,
        }
      }
      return {
        availability: entity.thumbnailPhotoAvailability,
        urls: entity.thumbnailPhotoUrls,
        dataObject: entity.thumbnailPhotoDataObject,
      }
    }
    return null
  }, [entity, assetType])

  const testAsset = useCallback(
    (assetUrl: string) => {
      setIsLoading(true)
      const onError = (error: ErrorEvent) => {
        setIsLoading(false)
        setError(error)
      }

      const onLoad = () => {
        setIsLoading(false)
        setUrl(assetUrl)
      }

      if ([AssetType.COVER, AssetType.THUMBNAIL, AssetType.AVATAR].includes(assetType)) {
        const img = new Image()
        img.addEventListener('error', onError)
        img.addEventListener('load', onLoad)
        img.src = assetUrl
      } else {
        const video = document.createElement('video')
        video.addEventListener('error', onError)
        video.addEventListener('loadstart', onLoad)
        video.src = assetUrl
      }
    },
    [assetType]
  )

  useEffect(() => {
    if (assetData && (!url || !isEqual(assetData, cachedAssetData.current)) && !isLoading && !error) {
      cachedAssetData.current = assetData
      if (assetData.availability !== AssetAvailability.Accepted) {
        return
      }
      if (assetData.urls?.length) {
        testAsset(assetData.urls[0])
        return
      }
      if (!assetData.dataObject?.joystreamContentId) {
        return
      }
      if (assetData.dataObject?.liaison?.isActive && assetData.dataObject?.liaison?.metadata) {
        testAsset(
          createStorageNodeUrl(assetData.dataObject.joystreamContentId, assetData.dataObject?.liaison?.metadata)
        )
        return
      }

      const randomStorageUrl = getStorageProvider()
      if (randomStorageUrl && assetData.dataObject) {
        testAsset(createStorageNodeUrl(assetData.dataObject.joystreamContentId, randomStorageUrl.url))
        return
      }
    }
    if (!assetData) {
      setUrl(undefined)
    }
  }, [assetData, getStorageProvider, url, testAsset, isLoading, error])

  return { url, error, isLoading }
}
