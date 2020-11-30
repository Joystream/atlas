import React from 'react'
import { RouteComponentProps, useParams } from '@reach/router'
import { useQuery } from '@apollo/client'

import { GET_CHANNEL } from '@/api/queries/channels'
import { GetChannel, GetChannelVariables } from '@/api/queries/__generated__/GetChannel'

import {
  AvatarPlaceholder,
  CoverImage,
  Header,
  MediaWrapper,
  StyledAvatar,
  Title,
  TitleContainer,
  TitlePlaceholder,
  TitleSection,
  VideoSection,
} from './ChannelView.style'
import { InfiniteVideoGrid } from '@/shared/components'

const DEFAULT_CHANNEL_COVER_URL = 'https://eu-central-1.linodeobjects.com/atlas-assets/default-channel-cover.png'

const ChannelView: React.FC<RouteComponentProps> = () => {
  const { id } = useParams()
  const { data, error } = useQuery<GetChannel, GetChannelVariables>(GET_CHANNEL, {
    variables: { id },
  })

  if (error) {
    throw error
  }

  return (
    <div>
      <Header>
        <MediaWrapper>
          <CoverImage src={data?.channel?.coverPhotoUrl || DEFAULT_CHANNEL_COVER_URL} />
        </MediaWrapper>
        <TitleSection>
          {data?.channel ? (
            <>
              <StyledAvatar img={data.channel.avatarPhotoUrl} name={data.channel.handle} />
              <TitleContainer>
                <Title>{data.channel.handle}</Title>
              </TitleContainer>
            </>
          ) : (
            <>
              <AvatarPlaceholder />
              <TitlePlaceholder />
            </>
          )}
        </TitleSection>
      </Header>
      <VideoSection>
        <InfiniteVideoGrid channelId={id} />
      </VideoSection>
    </div>
  )
}
export default ChannelView
