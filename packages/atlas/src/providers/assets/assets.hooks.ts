import { useCallback, useEffect, useMemo, useState } from 'react'

import { BasicMembershipFieldsFragment, StorageDataObjectFieldsFragment, SubtitlesFieldsFragment } from '@/api/queries'
import { LANGUAGES_LOOKUP } from '@/config/languages'

import { ResolvedAsset, useAssetStore } from './assets.store'

export const useAsset = (dataObject?: StorageDataObjectFieldsFragment | null) => {
  const contentId = dataObject?.id ?? null
  const asset = useAssetStore((state) => (contentId ? state.assets[contentId] : null))
  const pendingAsset = useAssetStore((state) => (contentId ? state.pendingAssets[contentId] : null))
  const addPendingAsset = useAssetStore((state) => state.actions.addPendingAsset)

  useEffect(() => {
    if (asset || pendingAsset || !contentId || !dataObject) return

    addPendingAsset(contentId, dataObject)
  }, [addPendingAsset, asset, dataObject, contentId, pendingAsset])

  return { url: asset?.url, isLoadingAsset: !!dataObject && !!contentId && !asset }
}

export const useRawAsset = (contentId: string | null) => {
  return useAssetStore((state) => (contentId ? state.assets[contentId] : null))
}

export const useRawAssetResolver = () => {
  return (contentId: string | null) => (contentId ? useAssetStore.getState().assets[contentId] : null)
}

export const useMemberAvatar = (member?: BasicMembershipFieldsFragment | null): ReturnType<typeof useAsset> => {
  const avatar = member?.metadata.avatar
  const avatarAsset = useAsset(avatar?.__typename === 'AvatarObject' ? avatar.avatarObject : null)

  if (avatar?.__typename === 'AvatarUri') {
    return { url: avatar.avatarUri, isLoadingAsset: false }
  } else if (avatar?.__typename === 'AvatarObject') {
    return avatarAsset
  }

  return { url: null, isLoadingAsset: true }
}

export const useSubtitlesAssets = (subtitles?: SubtitlesFieldsFragment[] | null) => {
  const addPendingAsset = useAssetStore((state) => state.actions.addPendingAsset)
  const pendingAssets = useAssetStore((state) => state.pendingAssets)
  const assets = useAssetStore((state) => state.assets)
  const [resolvedAssets, setResolvedAssets] = useState<Record<string, ResolvedAsset>>()
  const dataObjects = useMemo(() => subtitles?.map((item) => item.asset), [subtitles])

  const checkDataObjectsIn = useCallback(
    (object: Record<string, unknown>) => {
      if (!dataObjects || !dataObjects.length) {
        return false
      }
      const mappedDataObjectsIds = dataObjects?.map((dataObject) => dataObject?.id) || []
      return Object.keys(object).some((id) => mappedDataObjectsIds.includes(id))
    },
    [dataObjects]
  )

  useEffect(() => {
    if (
      !dataObjects ||
      !dataObjects.length ||
      checkDataObjectsIn(pendingAssets) ||
      (resolvedAssets && checkDataObjectsIn(resolvedAssets))
    ) {
      return
    }
    dataObjects.forEach((dataObject) => {
      const contentId = dataObject?.id
      if (contentId) {
        addPendingAsset(contentId, dataObject, true)
      }
    })
  }, [addPendingAsset, checkDataObjectsIn, dataObjects, pendingAssets, resolvedAssets])

  useEffect(() => {
    if (!dataObjects || !dataObjects.length || checkDataObjectsIn(pendingAssets)) {
      return
    }
    const resolvedSubtitles: Record<string, ResolvedAsset> = {}

    dataObjects?.forEach((item) => {
      if (!item) {
        return
      }
      const resolvedAsset = assets[item.id]

      if (resolvedAsset) {
        resolvedSubtitles[item.id] = assets[item.id]
      }
    })

    setResolvedAssets(Object.keys(resolvedSubtitles).length ? resolvedSubtitles : undefined)
  }, [assets, checkDataObjectsIn, dataObjects, pendingAssets])

  return useMemo(() => {
    if (!subtitles || !resolvedAssets) {
      return
    }
    return subtitles.map((item) => {
      const resolvedLanguageName = LANGUAGES_LOOKUP[item.language.iso]
      const url = item.assetId && resolvedAssets[item.assetId].url
      return {
        label: item.type === 'subtitles' ? resolvedLanguageName : `${resolvedLanguageName} (CC)`,
        language: item.type === 'subtitles' ? item.language.iso : `${item.language.iso}-cc`,
        src: url || '',
      }
    })
  }, [resolvedAssets, subtitles])
}
