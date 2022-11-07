import { useCallback } from 'react'

import { useFollowChannel, useUnfollowChannel } from '@/api/hooks/channel'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { usePersonalDataStore } from '@/providers/personalData'
import { SentryLogger } from '@/utils/logs'

export const useHandleFollowChannel = (id?: string, name?: string | null) => {
  const [openUnfollowDialog, closeUnfollowDialog] = useConfirmationModal()
  const { followChannel } = useFollowChannel()
  const { unfollowChannel } = useUnfollowChannel()
  const isFollowing = usePersonalDataStore((state) => state.followedChannels.some((channel) => channel.id === id))
  const updateChannelFollowing = usePersonalDataStore((state) => state.actions.updateChannelFollowing)

  const toggleFollowing = useCallback(() => {
    if (!id || !name) {
      return
    }
    try {
      if (isFollowing) {
        openUnfollowDialog({
          type: 'warning',
          title: 'Do you want to unfollow?',
          description: `Unfollowing ${name} will no longer show new content from this channel on your following page.`,
          primaryButton: {
            text: 'Unfollow',
            onClick: () => {
              updateChannelFollowing(id, false)
              unfollowChannel(id)
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
        updateChannelFollowing(id, true)
        followChannel(id)
      }
    } catch (error) {
      SentryLogger.error('Failed to update channel following', 'useHandleFollowChannel', error, { channel: { id } })
    }
  }, [
    closeUnfollowDialog,
    followChannel,
    id,
    isFollowing,
    name,
    openUnfollowDialog,
    unfollowChannel,
    updateChannelFollowing,
  ])
  return {
    toggleFollowing,
    isFollowing,
  }
}
