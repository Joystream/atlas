import React, { useState, useEffect } from 'react'
import { RouteComponentProps, useParams } from '@reach/router'
import { useQuery, useMutation } from '@apollo/client'

import { GET_CHANNEL, FOLLOW_CHANNEL, UNFOLLOW_CHANNEL } from '@/api/queries/channels'
import { GetChannel, GetChannelVariables } from '@/api/queries/__generated__/GetChannel'

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
  StyledButton,
} from './ChannelView.style'
import { BackgroundPattern, InfiniteVideoGrid } from '@/components'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { transitions } from '@/shared/theme'
import { formatNumberShort } from '@/utils/number'

type FollowedChannel = {
  id: string
}

const ChannelView: React.FC<RouteComponentProps> = () => {
  const { id } = useParams()
  const { data, loading, error } = useQuery<GetChannel, GetChannelVariables>(GET_CHANNEL, {
    variables: { id },
  })
  const [followChannel] = useMutation<GetChannelVariables>(FOLLOW_CHANNEL, {
    variables: {
      channelId: id,
    },
  })
  const [unfollowChannel] = useMutation<GetChannelVariables>(UNFOLLOW_CHANNEL, {
    variables: {
      channelId: id,
    },
  })
  const { updateChannelFollowing } = usePersonalData()
  const [isFollowing, setFollowing] = useState<boolean>()

  useEffect(() => {
    const followedChannels = localStorage.getItem('followedChannels')
    if (!followedChannels) {
      return
    }
    const parsedFollowedChannels: FollowedChannel[] = JSON.parse(followedChannels)
    const isFollowing = parsedFollowedChannels.some((channel) => channel.id === id)
    setFollowing(isFollowing)
  }, [id])

  const handleFollow = () => {
    if (isFollowing) {
      updateChannelFollowing(id, false)
      unfollowChannel()
      setFollowing(false)
    } else {
      updateChannelFollowing(id, true)
      followChannel()
      setFollowing(true)
    }
  }
  if (error) {
    throw error
  }

  if (!loading && !data?.channel) {
    return <span>Channel not found</span>
  }

  const showBgPattern = !data?.channel?.coverPhotoUrl

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
                {showBgPattern ? <BackgroundPattern /> : <CoverImage src={data?.channel?.coverPhotoUrl!} />}
              </CSSTransition>
            </TransitionGroup>
          </Media>
        </MediaWrapper>
        <TitleSection>
          <StyledChannelLink id={data?.channel?.id} avatarSize="view" hideHandle noLink />
          <TitleContainer>
            {data?.channel ? (
              <>
                <Title variant="h1">{data.channel.handle}</Title>
                <SubTitle>{data.channel.follows ? formatNumberShort(data.channel.follows) : 0} Followers</SubTitle>
              </>
            ) : (
              <>
                <TitlePlaceholder />
                <SubTitlePlaceholder />
              </>
            )}
          </TitleContainer>
          <StyledButton variant={isFollowing ? 'secondary' : 'primary'} onClick={handleFollow}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </StyledButton>
        </TitleSection>
      </Header>
      <VideoSection>
        <InfiniteVideoGrid channelId={id} showChannel={false} />
      </VideoSection>
    </>
  )
}
export default ChannelView
