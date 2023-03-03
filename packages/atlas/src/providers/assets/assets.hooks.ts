import { useEffect, useMemo, useState } from 'react'
import shallow from 'zustand/shallow'

import { BasicMembershipFieldsFragment, SubtitlesFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { ChannelId } from '@/joystream-lib/types'
import { useStorageOperators } from '@/providers/assets/assets.provider'
import { createChannelBagId } from '@/utils/asset'
import { createLookup } from '@/utils/data'

import { ResolvedAsset, useAssetStore } from './assets.store'

export const useRawAsset = (contentId: string | null) => {
  return useAssetStore((state) => (contentId ? state.assets[contentId] : null))
}

export const useRawAssetResolver = () => {
  return (contentId: string | null) => (contentId ? useAssetStore.getState().assets[contentId] : null)
}

export const useMemberAvatar = (member?: BasicMembershipFieldsFragment | null) => {
  const avatar = member?.metadata?.avatar

  if (avatar?.__typename === 'AvatarUri') {
    return { url: avatar.avatarUri, isLoadingAsset: false }
  } else if (avatar?.__typename === 'AvatarObject') {
    return { url: avatar.avatarObject.resolvedUrl, isLoadingAsset: false }
  }
  // if avatar is `undefined` it means that avatar is not loaded yet, If it's `null` it means that it's not set
  return { url: null, isLoadingAsset: avatar === null ? false : true }
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
      pendingAssets[id] = !!state.pendingAssets[subtitle.asset.id]
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

export const useChannelsStorageBucketsCount = (channelId: ChannelId | null): number => {
  const [bucketsCount, setBucketsCount] = useState<number | null>(null)
  const { getAllStorageOperatorsForBag } = useStorageOperators()

  // update bucketsCount whenever channel changes
  useEffect(() => {
    // if the channel changed, set the value to null to not return stale result
    setBucketsCount(null)

    if (!channelId) return

    const bagId = createChannelBagId(channelId)

    getAllStorageOperatorsForBag(bagId, true).then((operators) => {
      setBucketsCount(operators?.length ?? null)
    })
  }, [channelId, getAllStorageOperatorsForBag])

  return bucketsCount ?? 0
}
