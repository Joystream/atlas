import { useEffect, useState } from 'react'

import { BasicMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { ChannelId } from '@/joystream-lib/types'
import { useStorageOperators } from '@/providers/assets/assets.provider'
import { createChannelBagId } from '@/utils/asset'

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
