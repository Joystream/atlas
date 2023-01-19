import { useCallback } from 'react'

import { useFollowChannel, useUnfollowChannel } from '@/api/hooks/channel'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { usePersonalDataStore } from '@/providers/personalData'
import { SentryLogger } from '@/utils/logs'

export const useHandleFollowChannel = (id?: string, name?: string | null) => {
  const [openUnfollowDialog, closeUnfollowDialog] = useConfirmationModal()
  const { followChannel } = useFollowChannel()
  const { unfollowChannel } = useUnfollowChannel()
  const follow = usePersonalDataStore((state) => state.followedChannels.find((channel) => channel.id === id))
  const { followChannel: followChannelInStore, unfollowChannel: unfollowChannelInStore } = usePersonalDataStore(
    (state) => state.actions
  )

  const toggleFollowing = useCallback(async () => {
    if (!id || !name) {
      return
    }
    try {
      if (follow && follow.cancelToken) {
        openUnfollowDialog({
          type: 'warning',
          title: 'Do you want to unfollow?',
          description: `Unfollowing ${name} will no longer show new content from this channel on your following page.`,
          primaryButton: {
            text: 'Unfollow',
            onClick: () => {
              unfollowChannelInStore(id)
              unfollowChannel(id, follow.cancelToken)
              closeUnfollowDialog()
            },
            variant: 'destructive',
          },
          secondaryButton: {
            text: 'Keep following',
            onClick: () => {
              closeUnfollowDialog()
            },
          },
        })
      } else {
        const followResponse = await followChannel(id)
        const cancelToken = followResponse.data?.followChannel.cancelToken
        if (cancelToken) {
          followChannelInStore(id, cancelToken)
        }
      }
    } catch (error) {
      SentryLogger.error('Failed to update channel following', 'useHandleFollowChannel', error, { channel: { id } })
    }
  }, [
    id,
    name,
    follow,
    openUnfollowDialog,
    unfollowChannelInStore,
    unfollowChannel,
    closeUnfollowDialog,
    followChannel,
    followChannelInStore,
  ])
  return {
    toggleFollowing,
    isFollowing: !!follow,
  }
}
