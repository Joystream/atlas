import React, { useState, useEffect } from 'react'
import { RouteComponentProps, useParams } from '@reach/router'

import { useFollowingChannel, useChannel } from '@/api/hooks'
import { usePersonalData } from '@/hooks'

import {
  CoverImage,
  Header,
  Media,
  MediaWrapper,
  StyledChannelLink,
  Title,
  TitleContainer,
  TitlePlaceholder,
  TitleSection,
  VideoSection,
  SubTitle,
  SubTitlePlaceholder,
  StyledButtonContainer,
} from './ChannelView.style'
import { BackgroundPattern, InfiniteVideoGrid } from '@/components'
import { Button } from '@/shared/components'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { transitions } from '@/shared/theme'
import { formatNumberShort } from '@/utils/number'

const ChannelView: React.FC<RouteComponentProps> = () => {
  const { id } = useParams()
  const { channel, loading, error } = useChannel(id)
  const { followChannel, unfollowChannel } = useFollowingChannel(id)
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
        unfollowChannel()
        setFollowing(false)
      } else {
        updateChannelFollowing(id, true)
        followChannel()
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

  const showBgPattern = !channel?.coverPhotoUrl

  return (
    <>
      <Header>
        <MediaWrapper>
          <Media>
            <TransitionGroup>
              <CSSTransition
                key={showBgPattern ? 'pattern' : 'cover'}
                timeout={parseInt(transitions.timings.loading)}
                classNames={transitions.names.fade}
              >
                {showBgPattern ? <BackgroundPattern /> : <CoverImage src={channel?.coverPhotoUrl!} />}
              </CSSTransition>
            </TransitionGroup>
          </Media>
        </MediaWrapper>
        <TitleSection>
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
            <Button variant={isFollowing ? 'secondary' : 'primary'} onClick={handleFollow}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          </StyledButtonContainer>
        </TitleSection>
      </Header>
      <VideoSection>
        <InfiniteVideoGrid channelId={id} showChannel={false} />
      </VideoSection>
    </>
  )
}
export default ChannelView
