import { useEffect } from 'react'

import { BasicMembershipFieldsFragment, StorageDataObjectFieldsFragment } from '@/api/queries'

import { useAssetStore } from './assets.store'

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
