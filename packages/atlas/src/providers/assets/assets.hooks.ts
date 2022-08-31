import { useEffect, useMemo } from 'react'
import shallow from 'zustand/shallow'

import { BasicMembershipFieldsFragment, StorageDataObjectFieldsFragment, SubtitlesFieldsFragment } from '@/api/queries'
import { createLookup } from '@/utils/data'

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
  // get mapping from subtitle ID to subtitle (but only for subtitles with asset)
  const subtitlesWithAssetLookup = useMemo(() => {
    if (!subtitles || !subtitles.length) return {}
    const subsWithAsset = subtitles.filter((s) => !!s.asset)
    return createLookup(subsWithAsset)
  }, [subtitles])

  // get mapping from subtitle ID to asset
  const subtitlesAssets = useAssetStore((state) => {
    const assets = {} as Record<string, ResolvedAsset | null>
    Object.entries(subtitlesWithAssetLookup).forEach(([id, subtitle]) => {
      if (!subtitle.asset) return
      const asset = state.assets[subtitle.asset.id]
      assets[id] = asset || null
    })
    return assets
  }, shallow)

  // get mapping from subtitle ID to asset pending status
  const subtitlesPendingAssets = useAssetStore((state) => {
    const pendingAssets = {} as Record<string, boolean>
    Object.entries(subtitlesWithAssetLookup).forEach(([id, subtitle]) => {
      if (!subtitle.asset) return
      pendingAssets[id] = !!state.immediatePendingAssets[subtitle.asset.id]
    })
    return pendingAssets
  }, shallow)

  const addPendingAsset = useAssetStore((state) => state.actions.addPendingAsset)

  // request resolution of subtitle assets that are not pending
  useEffect(() => {
    Object.entries(subtitlesAssets).forEach(([id, resolvedAsset]) => {
      if (!resolvedAsset && !subtitlesPendingAssets[id]) {
        const subtitleAsset = subtitlesWithAssetLookup[id].asset
        if (subtitleAsset) {
          addPendingAsset(subtitleAsset.id, subtitleAsset, true)
        }
      }
    })
  }, [addPendingAsset, subtitlesAssets, subtitlesPendingAssets, subtitlesWithAssetLookup])

  return subtitlesAssets
}
