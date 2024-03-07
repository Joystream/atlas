import { useCallback } from 'react'

import { useFollowChannel, useUnfollowChannel } from '@/api/hooks/channel'
import { useGetChannelFollowsQuery } from '@/api/queries/__generated__/accounts.generated'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useUser } from '@/providers/user/user.hooks'
import { SentryLogger } from '@/utils/logs'

export const useHandleFollowChannel = (channelId?: string, channelTitle?: string | null) => {
  const [openUnfollowDialog, closeUnfollowDialog] = useConfirmationModal()
  const { followChannel } = useFollowChannel()
  const { accountId } = useUser()
  const { unfollowChannel } = useUnfollowChannel()
  const { data } = useGetChannelFollowsQuery({
    variables: {
      where: {
        channelId_eq: channelId,
        user: {
          account: {
            id_eq: accountId,
          },
        },
      },
      limit: 1,
    },
    skip: !accountId || !channelTitle || !channelId,
  })
  const follow = !!data?.channelFollows.length

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
