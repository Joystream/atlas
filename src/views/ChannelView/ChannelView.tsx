import { useChannel, useFollowChannel, useUnfollowChannel } from '@/api/hooks'
import { InfiniteVideoGrid, ViewWrapper } from '@/components'
import { usePersonalData } from '@/hooks'
import { ChannelCover } from '@/shared/components'
import { transitions } from '@/shared/theme'
import { formatNumberShort } from '@/utils/number'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  ChannelInfo,
  Header,
  StyledAvatar,
  StyledButton,
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

  const avatarPhotoUrl = channel?.avatarPhotoUrl
  const coverPhotoUrl = channel?.coverPhotoUrl

  return (
    <ViewWrapper>
      <Header>
        <ChannelCover coverPhotoUrl={coverPhotoUrl} />
        <TitleSection className={transitions.names.slide}>
          <ChannelInfo>
            <StyledAvatar imageUrl={avatarPhotoUrl} size="view" loading={!channel} />
            <TitleContainer>
              {!channel ? (
                <>
                  <TitlePlaceholder />
                  <SubTitlePlaceholder />
                </>
              ) : (
                <>
                  <Title variant="h1">{channel.handle}</Title>
                  <SubTitle>{channel.follows ? formatNumberShort(channel.follows) : 0} Followers</SubTitle>
                </>
              )}
            </TitleContainer>
          </ChannelInfo>
          <StyledButton variant={isFollowing ? 'secondary' : 'primary'} size="small" onClick={handleFollow}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </StyledButton>
        </TitleSection>
      </Header>
      <VideoSection className={transitions.names.slide}>
        <InfiniteVideoGrid channelId={id} showChannel={false} />
      </VideoSection>
    </ViewWrapper>
  )
}
export default ChannelView
