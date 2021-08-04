import { useFollowChannel, useUnfollowChannel } from '@/api/hooks'
import { usePersonalDataStore } from '@/providers'
import { Logger } from '@/utils/logger'

export const useHandleFollowChannel = (id?: string) => {
  const { followChannel } = useFollowChannel()
  const { unfollowChannel } = useUnfollowChannel()
  const isFollowing = usePersonalDataStore((state) => state.followedChannels.some((channel) => channel.id === id))
  const updateChannelFollowing = usePersonalDataStore((state) => state.actions.updateChannelFollowing)

  const _followChannel = () => {
    if (!id) {
      return
    }
    try {
      if (isFollowing) {
        updateChannelFollowing(id, false)
        unfollowChannel(id)
      } else {
        updateChannelFollowing(id, true)
        followChannel(id)
      }
    } catch (error) {
      Logger.warn('Failed to update Channel following', { error })
    }
  }
  return {
    followChannel: _followChannel,
    isFollowing,
  }
}
