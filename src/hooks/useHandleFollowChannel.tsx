import React from 'react'

import { useFollowChannel, useUnfollowChannel } from '@/api/hooks'
import { useDialog } from '@/providers/dialogs'
import { usePersonalDataStore } from '@/providers/personalData'
import { Text } from '@/shared/components/Text'
import { SentryLogger } from '@/utils/logs'
import { UnfollowDescriptionContainer } from '@/views/viewer/ChannelView/ChannelView.style'

export const useHandleFollowChannel = (id?: string, name?: string | null) => {
  const [openUnfollowDialog, closeUnfollowDialog] = useDialog()
  const { followChannel } = useFollowChannel()
  const { unfollowChannel } = useUnfollowChannel()
  const isFollowing = usePersonalDataStore((state) => state.followedChannels.some((channel) => channel.id === id))
  const updateChannelFollowing = usePersonalDataStore((state) => state.actions.updateChannelFollowing)

  const toggleFollowing = () => {
    if (!id || !name) {
      return
    }
    try {
      if (isFollowing) {
        openUnfollowDialog({
          variant: 'error',
          exitButton: false,
          error: true,
          title: 'Would you consider staying?',
          description: (
            <UnfollowDescriptionContainer>
              <Text variant="body2" as="span" secondary>
                Unfollowing {name} will no longer show new content from this channel on your following page.
              </Text>
            </UnfollowDescriptionContainer>
          ),
          primaryButton: {
            text: 'Unfollow',
            onClick: () => {
              updateChannelFollowing(id, false)
              unfollowChannel(id)
              closeUnfollowDialog()
            },
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
      SentryLogger.error('Failed to update channel following', 'ChannelView', error, { channel: { id } })
    }
  }
  return {
    toggleFollowing,
    isFollowing,
  }
}
