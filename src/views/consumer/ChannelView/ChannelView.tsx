import { useChannel, useFollowChannel, useUnfollowChannel } from '@/api/hooks'
import { InfiniteVideoGrid, ViewWrapper } from '@/components'
import { usePersonalData } from '@/hooks'
import { Button, ChannelCover } from '@/shared/components'
import { transitions } from '@/shared/theme'
import { formatNumberShort } from '@/utils/number'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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

const ChannelView: React.FC = () => {
  const { id } = useParams()
  const { channel, loading, error } = useChannel(id)
  const { followChannel } = useFollowChannel()
  const { unfollowChannel } = useUnfollowChannel()
  const {
    state: { followedChannels },
    updateChannelFollowing,
  } = usePersonalData()
  const [isFollowing, setFollowing] = useState<boolean>()

  useEffect(() => {
    const isFollowing = followedChannels.some((channel) => channel.id === id)
    setFollowing(isFollowing)
  }, [followedChannels, id])

  const handleFollow = () => {
    try {
      if (isFollowing) {
        updateChannelFollowing(id, false)
        unfollowChannel(id)
        setFollowing(false)
      } else {
        updateChannelFollowing(id, true)
        followChannel(id)
        setFollowing(true)
      }
    } catch (error) {
      console.warn('Failed to update Channel following', { error })
    }
  }
  if (error) {
    throw error
  }

  if (!loading && !channel) {
    return <span>Channel not found</span>
  }

  const coverPhotoUrl = channel?.coverPhotoUrl

  return (
    <ViewWrapper>
      <Header>
        <ChannelCover coverPhotoUrl={coverPhotoUrl} />
        <TitleSection className={transitions.names.slide}>
          <StyledChannelLink id={channel?.id} avatarSize="view" hideHandle noLink />
          <TitleContainer>
            {channel ? (
              <>
                <Title variant="h1">{channel.handle}</Title>
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
export default ChannelView
