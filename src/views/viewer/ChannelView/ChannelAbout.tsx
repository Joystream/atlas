import React from 'react'
import { useParams } from 'react-router'

import { useChannel, useChannelVideoCount } from '@/api/hooks'
import { languages } from '@/config/languages'
import { GridItem } from '@/shared/components/LayoutGrid/LayoutGrid'
import { Text } from '@/shared/components/Text'
import { formatNumberShort } from '@/utils/number'
import { formatDate } from '@/utils/time'

import {
  AvatarContainer,
  Details,
  DetailsText,
  StyledAvatar,
  StyledLayoutGrid,
  TextContainer,
} from './ChannelAbout.style'

export const ChannelAbout = () => {
  const { id } = useParams()
  const { channel } = useChannel(id)
  const { videoCount } = useChannelVideoCount(id)
  return (
    <StyledLayoutGrid>
      <GridItem colSpan={{ base: 12, small: 8 }} rowStart={{ base: 2, small: 1 }}>
        {!!channel?.description && (
          <TextContainer>
            <Text variant="h4">Description</Text>
            <Text variant="body1" secondary>
              {channel.description}
            </Text>
          </TextContainer>
        )}
      </GridItem>
      <GridItem colSpan={{ base: 12, small: 3 }} colStart={{ small: -4 }}>
        <DetailsText variant="h4">Details</DetailsText>

        <Details>
          <Text variant="caption" secondary>
            Owned by member
          </Text>
          <AvatarContainer>
            <StyledAvatar assetUrl={channel?.ownerMember?.avatarUri} />
            <Text variant="body1">{channel?.ownerMember?.handle}</Text>
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
          <Text variant="body1">{typeof channel?.views === 'number' ? formatNumberShort(channel.views) : ''}</Text>
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
      </GridItem>
    </StyledLayoutGrid>
  )
}
