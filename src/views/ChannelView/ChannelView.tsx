import React from 'react'
import { RouteComponentProps, useParams } from '@reach/router'
import { useQuery } from '@apollo/client'

import { GET_CHANNEL } from '@/api/queries/channels'
import { GetChannel, GetChannelVariables } from '@/api/queries/__generated__/GetChannel'

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
} from './ChannelView.style'
import { BackgroundPattern } from '@/components'
import { InfiniteVideoGrid } from '@/shared/components'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { transitions } from '@/shared/theme'
import { formatNumberShort } from '@/utils/number'

const ChannelView: React.FC<RouteComponentProps> = () => {
  const { id } = useParams()
  const { data, loading, error } = useQuery<GetChannel, GetChannelVariables>(GET_CHANNEL, {
    variables: { id },
  })

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
        </TitleSection>
      </Header>
      <VideoSection>
        <InfiniteVideoGrid channelId={id} />
      </VideoSection>
    </>
  )
}
export default ChannelView
