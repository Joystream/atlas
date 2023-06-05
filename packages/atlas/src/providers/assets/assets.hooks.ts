import { useEffect, useState } from 'react'

import { ChannelId } from '@/joystream-lib/types'
import { useStorageOperators } from '@/providers/assets/assets.provider'
import { createChannelBagId } from '@/utils/asset'

export const useChannelsStorageBucketsCount = (channelId: ChannelId | null): number => {
  const [bucketsCount, setBucketsCount] = useState<number | null>(null)
  const { getAvailableBucketsCountForBag } = useStorageOperators()

  // update bucketsCount whenever channel changes
  useEffect(() => {
    // if the channel changed, set the value to null to not return stale result
    setBucketsCount(null)

    if (!channelId) return

    const bagId = createChannelBagId(channelId)

    getAvailableBucketsCountForBag(bagId).then((length) => {
      setBucketsCount(length ?? null)
    })
  }, [channelId, getAvailableBucketsCountForBag])

  return bucketsCount ?? 0
}
