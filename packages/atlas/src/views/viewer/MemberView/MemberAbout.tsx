import React from 'react'
import { useParams } from 'react-router'

import { useMemberships } from '@/api/hooks'
import { GridItem } from '@/components/LayoutGrid/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { PIONEER_MEMBER_URL } from '@/config/urls'
import { cVar } from '@/styles'
import { formatDate } from '@/utils/time'

import {
  Anchor,
  ChannelsOwnedContainerGrid,
  Details,
  DetailsText,
  StyledChannelCard,
  StyledLayoutGrid,
  TextContainer,
} from './MemberAbout.styles'

export const MemberAbout = () => {
  const { handle } = useParams()
  const { memberships } = useMemberships({ where: { handle_eq: handle } })
  const member = memberships?.find((member) => member.handle === handle)

  return (
    <StyledLayoutGrid>
      <GridItem colSpan={{ base: 12, sm: 8 }} rowStart={{ base: 2, sm: 1 }}>
        {!!member?.metadata.about && (
          <TextContainer withDivider={!!member?.channels.length}>
            <Text variant="h500">About me</Text>
            <Text variant="t300" secondary>
              {member.metadata.about}
            </Text>
          </TextContainer>
        )}
        {!!member?.channels.length && (
          <div>
            <Text variant="h500">Channels owned</Text>
            <ChannelsOwnedContainerGrid>
              {member?.channels.map((channel) => (
                <GridItem key={channel.id} colSpan={{ base: 6, lg: 3 }}>
                  <StyledChannelCard withFollowButton={false} channel={channel} />
                </GridItem>
              ))}
            </ChannelsOwnedContainerGrid>
          </div>
        )}
      </GridItem>
      <GridItem colSpan={{ base: 12, sm: 3 }} colStart={{ sm: -4 }}>
        <DetailsText variant="h500">Details</DetailsText>

        <Details>
          <Text variant="t100" secondary>
            Join date
          </Text>
          <Text variant="t300">{member?.createdAt ? formatDate(new Date(member.createdAt)) : ''}</Text>
        </Details>

        <Details>
          <Text variant="t100" secondary>
            Num. of channels
          </Text>
          <NumberFormat format="short" value={member?.channels.length ? member?.channels.length : 0} variant="t300" />
        </Details>

        <Anchor
          as="a"
          variant="t300-strong"
          href={`${PIONEER_MEMBER_URL}/${member?.id}`}
          target="_blank"
          color={cVar('colorCoreBlue300')}
        >
          Learn more
        </Anchor>
      </GridItem>
    </StyledLayoutGrid>
  )
}
