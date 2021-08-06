import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { useChannel, useFollowChannel, useUnfollowChannel } from '@/api/hooks'
import { InfiniteVideoGrid, ViewWrapper } from '@/components'
import { AssetType, useAsset, useDialog, usePersonalDataStore } from '@/providers'
import { Button, ChannelCover } from '@/shared/components'
import { transitions } from '@/shared/theme'
import { Logger } from '@/utils/logger'
import { formatNumberShort } from '@/utils/number'

import {
  Header,
  StyledButtonContainer,
  StyledChannelLink,
  SubTitle,
  SubTitlePlaceholder,
  Title,
  TitleContainer,
  TitlePlaceholder,
  TitleSection,
  VideoSection,
} from './ChannelView.style'

export const ChannelView: React.FC = () => {
  const [openUnfollowDialog, closeUnfollowDialog] = useDialog()
  const { id } = useParams()
  const { channel, loading, error } = useChannel(id)
  const { followChannel } = useFollowChannel()
  const { unfollowChannel } = useUnfollowChannel()
  const followedChannels = usePersonalDataStore((state) => state.followedChannels)
  const updateChannelFollowing = usePersonalDataStore((state) => state.actions.updateChannelFollowing)
  const [isFollowing, setFollowing] = useState<boolean>()
  const { url: coverPhotoUrl } = useAsset({
    entity: channel,
    assetType: AssetType.COVER,
  })

  useEffect(() => {
    const isFollowing = followedChannels.some((channel) => channel.id === id)
    setFollowing(isFollowing)
  }, [followedChannels, id])

  const handleFollow = () => {
    try {
      if (isFollowing) {
        openUnfollowDialog({
          variant: 'info',
          exitButton: false,
          description: `Do you want to unfollow ${channel?.title}?`,
          primaryButton: {
            text: 'Unfollow',
            textOnly: true,
            variant: 'destructive-secondary',
            onClick: () => {
              updateChannelFollowing(id, false)
              unfollowChannel(id)
              setFollowing(false)
              closeUnfollowDialog()
            },
          },
          secondaryButton: {
            text: 'Cancel',
            textOnly: true,
            variant: 'secondary',
            onClick: () => {
              closeUnfollowDialog()
            },
          },
        })
      } else {
        updateChannelFollowing(id, true)
        followChannel(id)
        setFollowing(true)
      }
    } catch (error) {
      Logger.warn('Failed to update Channel following', { error })
    }
  }
  if (error) {
    throw error
  }

  if (!loading && !channel) {
    return <span>Channel not found</span>
  }

  return (
    <ViewWrapper>
      <Header>
        <ChannelCover assetUrl={coverPhotoUrl} />
        <TitleSection className={transitions.names.slide}>
          <StyledChannelLink id={channel?.id} avatarSize="view" hideHandle noLink />
          <TitleContainer>
            {channel ? (
              <>
                <Title variant="h1">{channel.title}</Title>
                <SubTitle>{channel.follows ? formatNumberShort(channel.follows) : 0} Followers</SubTitle>
              </>
            ) : (
              <>
                <TitlePlaceholder />
                <SubTitlePlaceholder />
              </>
            )}
          </TitleContainer>
          <StyledButtonContainer>
            <Button variant={isFollowing ? 'secondary' : 'primary'} onClick={handleFollow} size="large">
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          </StyledButtonContainer>
        </TitleSection>
      </Header>
      <VideoSection className={transitions.names.slide}>
        <InfiniteVideoGrid channelId={id} showChannel={false} />
      </VideoSection>
    </ViewWrapper>
  )
}
