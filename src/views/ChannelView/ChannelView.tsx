import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'

import { GET_CHANNEL, FOLLOW_CHANNEL, UNFOLLOW_CHANNEL } from '@/api/queries/channels'
import { GetChannel, GetChannelVariables } from '@/api/queries/__generated__/GetChannel'
import { FollowChannel, FollowChannelVariables } from '@/api/queries/__generated__/followChannel'
import { UnfollowChannel, UnfollowChannelVariables } from '@/api/queries/__generated__/unfollowChannel'
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

type FollowedChannel = {
  id: string
}

const ChannelView: React.FC = () => {
  const { id } = useParams()
  const { data, loading, error } = useQuery<GetChannel, GetChannelVariables>(GET_CHANNEL, {
    variables: { id },
  })
  const [followChannel] = useMutation<FollowChannel, FollowChannelVariables>(FOLLOW_CHANNEL, {
    variables: {
      channelId: id,
    },
    update: (cache, mutationResult) => {
      cache.modify({
        id: cache.identify({
          __typename: 'Channel',
          id,
        }),
        fields: {
          follows: () => mutationResult.data?.followChannel.follows,
        },
      })
    },
  })
  const [unfollowChannel] = useMutation<UnfollowChannel, UnfollowChannelVariables>(UNFOLLOW_CHANNEL, {
    variables: {
      channelId: id,
    },
    update: (cache, mutationResult) => {
      cache.modify({
        id: cache.identify({
          __typename: 'Channel',
          id,
        }),
        fields: {
          follows: () => mutationResult.data?.unfollowChannel.follows,
        },
      })
    },
  })
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
