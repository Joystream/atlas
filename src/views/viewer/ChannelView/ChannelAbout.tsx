import React from 'react'
import { useParams } from 'react-router'

import { useChannel, useChannelVideoCount } from '@/api/hooks'
import { languages } from '@/config/languages'
import { Text } from '@/shared/components'
import { formatNumberShort } from '@/utils/number'
import { formatDate } from '@/utils/time'

import {
  AvatarContainer,
  Container,
  Details,
  DetailsContainer,
  DetailsText,
  StyledAvatar,
  TextContainer,
} from './ChannelAbout.style'

export const ChannelAbout = () => {
  const { id } = useParams()
  const { channel } = useChannel(id)
  const { videoCount } = useChannelVideoCount(id)
  return (
    <Container>
      <div>
        {!!channel?.description && (
          <TextContainer>
            <Text variant="h4">Description</Text>
            <Text variant="body1" secondary>
              {channel.description}
            </Text>
          </TextContainer>
        )}
        {/* hidding this until we can add links to channels */}
        {/* <LinksContainer>
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
        </LinksContainer> */}
      </div>
      <DetailsContainer>
        <DetailsText variant="h4">Details</DetailsText>

        <Details>
          <Text variant="caption" secondary>
            Owned by member
          </Text>
          <AvatarContainer>
            <StyledAvatar assetUrl={channel?.ownerMember?.avatarUri} />
            <Text variant="h6">{channel?.ownerMember?.handle}</Text>
          </AvatarContainer>
        </Details>

        <Details>
          <Text variant="caption" secondary>
            Joined on
          </Text>
          <Text variant="h6">{channel?.createdAt ? formatDate(new Date(channel.createdAt)) : ''}</Text>
        </Details>

        <Details>
          <Text variant="caption" secondary>
            Num. of views
          </Text>
          <Text variant="h6">{formatNumberShort(channel?.views ?? 0)}</Text>
        </Details>

        <Details>
          <Text variant="caption" secondary>
            Num. of videos
          </Text>
          <Text variant="h6">{videoCount}</Text>
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
