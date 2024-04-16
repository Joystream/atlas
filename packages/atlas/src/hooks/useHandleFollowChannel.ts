import { useCallback } from 'react'

import { useFollowChannel, useUnfollowChannel } from '@/api/hooks/channel'
import { useAuth } from '@/providers/auth/auth.hooks'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { SentryLogger } from '@/utils/logs'

export const useHandleFollowChannel = (channelId?: string, channelTitle?: string | null) => {
  const [openUnfollowDialog, closeUnfollowDialog] = useConfirmationModal()
  const { followChannel } = useFollowChannel()
  const { currentUser } = useAuth()
  const { unfollowChannel } = useUnfollowChannel()

  const follow = currentUser?.followedChannels.some((followage) => followage.channelId === channelId)

  const toggleFollowing = useCallback(async () => {
    if (!channelId || !channelTitle) {
      return
    }
    try {
      if (follow) {
        openUnfollowDialog({
          type: 'warning',
          title: 'Do you want to unfollow?',
          description: `Unfollowing ${channelTitle} will no longer show new content from this channel on your following page.`,
          primaryButton: {
            text: 'Unfollow',
            onClick: () => {
              unfollowChannel(channelId)
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
        await followChannel(channelId)
      }
    } catch (error) {
      SentryLogger.error('Failed to update channel following', 'useHandleFollowChannel', error, {
        channel: { channelId },
      })
    }
  }, [channelId, channelTitle, follow, openUnfollowDialog, unfollowChannel, closeUnfollowDialog, followChannel])
  return {
    toggleFollowing,
    isFollowing: follow,
  }
}
