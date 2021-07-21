import React from 'react'
import { useParams } from 'react-router'

import { useChannel, useChannelVideoCount } from '@/api/hooks'
import { languages } from '@/config/languages'
import { Text } from '@/shared/components'
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
      </div>
      <DetailsContainer>
        <DetailsText variant="h4">Details</DetailsText>

        <Details>
          <Text variant="caption" secondary>
            Owned by member
          </Text>
          <AvatarContainer>
            <StyledAvatar assetUrl={undefined} />
            <Text variant="body1">placeholder</Text>
          </AvatarContainer>
        </Details>

        <Details>
          <Text variant="caption" secondary>
            Joined on
          </Text>
          <Text variant="body1">{channel?.createdAt ? formatDate(new Date(channel.createdAt)) : ''}</Text>
        </Details>

        <Details>
          <Text variant="caption" secondary>
            Num. of views
          </Text>
          <Text variant="body1">7 245 345</Text>
        </Details>

        <Details>
          <Text variant="caption" secondary>
            Num. of videos
          </Text>
          <Text variant="body1">{videoCount}</Text>
        </Details>

        <Details>
          <Text variant="caption" secondary>
            Language
          </Text>
          <Text variant="body1">
            {channel?.language?.iso ? languages.find(({ value }) => value === channel.language?.iso)?.name : ''}
          </Text>
        </Details>
      </DetailsContainer>
    </Container>
  )
}
