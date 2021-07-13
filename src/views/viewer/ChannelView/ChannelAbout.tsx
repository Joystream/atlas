import React from 'react'
import { useParams } from 'react-router'

import { useChannel } from '@/api/hooks'
import { languages } from '@/config/languages'
import { Avatar, Button, Text } from '@/shared/components'

import {
  AvatarContainer,
  Container,
  Details,
  DetailsContainer,
  DetailsText,
  Links,
  LinksContainer,
  StyledAvatar,
  TextContainer,
} from './ChannelAbout.style'

export const ChannelAbout = () => {
  const { id } = useParams()
  const { channel } = useChannel(id)

  return (
    <Container>
      <div>
        <TextContainer>
          <Text variant="h4">Description</Text>
          <Text variant="body1" secondary>
            {channel?.description}
          </Text>
        </TextContainer>
        <LinksContainer>
          <Text variant="h4">Links</Text>
          <Links>
            <Button to="www.google.com" textOnly>
              content
            </Button>
            <Button to="www.google.com" textOnly>
              channel
            </Button>
            <Button to="www.google.com" textOnly>
              preparing
            </Button>
            <Button to="www.google.com" textOnly>
              Official channel
            </Button>
            <Button to="www.google.com" textOnly>
              wildcrypto.com
            </Button>
            <Button to="www.google.com" textOnly>
              content
            </Button>
            <Button to="www.google.com" textOnly>
              channel
            </Button>
            <Button to="www.google.com" textOnly>
              preparing
            </Button>
            <Button to="www.google.com" textOnly>
              Official channel
            </Button>
          </Links>
        </LinksContainer>
      </div>
      <DetailsContainer>
        <DetailsText variant="h4">Details</DetailsText>

        <Details>
          <Text variant="caption" secondary>
            Owned by member
          </Text>
          <AvatarContainer>
            <StyledAvatar />
            <Text variant="h6">Garry Covin</Text>
          </AvatarContainer>
        </Details>

        <Details>
          <Text variant="caption" secondary>
            Joined on
          </Text>
          <Text variant="h6">6 Jan 2019</Text>
        </Details>

        <Details>
          <Text variant="caption" secondary>
            Num. of views
          </Text>
          <Text variant="h6">7 245 345</Text>
        </Details>

        <Details>
          <Text variant="caption" secondary>
            Num. of videos
          </Text>
          <Text variant="h6">116</Text>
        </Details>

        <Details>
          <Text variant="caption" secondary>
            Language
          </Text>
          <Text variant="h6">
            {channel?.language?.iso ? languages.find(({ value }) => value === channel.language?.iso)?.name : ''}
          </Text>
        </Details>
      </DetailsContainer>
    </Container>
  )
}
