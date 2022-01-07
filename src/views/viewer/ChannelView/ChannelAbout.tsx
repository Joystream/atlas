import React from 'react'
import { useParams } from 'react-router'

import { useChannel, useChannelVideoCount } from '@/api/hooks'
import { GridItem } from '@/components/LayoutGrid/LayoutGrid'
import { Text } from '@/components/Text'
import { languages } from '@/config/languages'
import { PIONEER_URL } from '@/config/urls'
import { formatNumberShort } from '@/utils/number'
import { formatDate } from '@/utils/time'

import {
  Anchor,
  AvatarContainer,
  Details,
  DetailsText,
  StyledAvatar,
  StyledLayoutGrid,
  TextContainer,
} from './ChannelAbout.styles'

export const ChannelAbout = () => {
  const { id } = useParams()
  const { channel } = useChannel(id ?? '')
  const { videoCount } = useChannelVideoCount(id ?? '')
  return (
    <StyledLayoutGrid>
      <GridItem colSpan={{ xxs: 12, sm: 8 }} rowStart={{ xxs: 2, sm: 1 }}>
        {!!channel?.description && (
          <TextContainer>
            <Text variant="h500">Description</Text>
            <Text variant="t300" secondary>
              {channel.description}
            </Text>
          </TextContainer>
        )}
      </GridItem>
      <GridItem colSpan={{ xxs: 12, sm: 3 }} colStart={{ sm: -4 }}>
        <DetailsText variant="h500">Details</DetailsText>

        <Details>
          <Text variant="t100" secondary>
            Owned by member
          </Text>
          <AvatarContainer>
            <StyledAvatar size="small" assetUrl={channel?.ownerMember?.avatarUri} />
            <Anchor
              as="a"
              variant="t300"
              href={`${PIONEER_URL}/#/members/${channel?.ownerMember?.handle}`}
              target="_blank"
            >
              {channel?.ownerMember?.handle}
            </Anchor>
          </AvatarContainer>
        </Details>

        <Details>
          <Text variant="t100" secondary>
            Joined on
          </Text>
          <Text variant="t300">{channel?.createdAt ? formatDate(new Date(channel.createdAt)) : ''}</Text>
        </Details>

        <Details>
          <Text variant="t100" secondary>
            Num. of views
          </Text>
          <Text variant="t300">{typeof channel?.views === 'number' ? formatNumberShort(channel.views) : ''}</Text>
        </Details>

        <Details>
          <Text variant="t100" secondary>
            Num. of videos
          </Text>
          <Text variant="t300">{videoCount}</Text>
        </Details>

        <Details>
          <Text variant="t100" secondary>
            Language
          </Text>
          <Text variant="t300">
            {channel?.language?.iso ? languages.find(({ value }) => value === channel.language?.iso)?.name : ''}
          </Text>
        </Details>
      </GridItem>
    </StyledLayoutGrid>
  )
}
