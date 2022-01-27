import React from 'react'
import { useParams } from 'react-router'

import { useMemberships } from '@/api/hooks'
import { GridItem } from '@/components/LayoutGrid/LayoutGrid'
import { Text } from '@/components/Text'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { PIONEER_URL } from '@/config/urls'
import { cVar } from '@/styles'
import { SentryLogger } from '@/utils/logs'
import { formatNumberShort } from '@/utils/number'

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
  const { memberships, error, loading } = useMemberships(
    { where: { handle_eq: handle } },
    {
      onError: (error) => SentryLogger.error('Failed to fetch memberships', 'ActiveUserProvider', error),
    }
  )
  const activeMembership = memberships?.find((member) => member.handle === handle)

  if (error) {
    return <ViewErrorFallback />
  }
  return (
    <StyledLayoutGrid>
      <GridItem colSpan={{ base: 12, sm: 8 }} rowStart={{ base: 2, sm: 1 }}>
        {!!activeMembership?.about && (
          <TextContainer>
            <Text variant="h500">About me</Text>
            <Text variant="t300" secondary>
              {activeMembership.about}
            </Text>
          </TextContainer>
        )}
        {!!activeMembership?.channels.length && (
          <div>
            <Text variant="h500">Channels owned</Text>
            <ChannelsOwnedContainerGrid>
              {activeMembership?.channels.map((channel) => (
                <GridItem key={channel.id} colSpan={{ base: 6, lg: 3 }}>
                  <StyledChannelCard channel={channel} />
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
          <Text variant="t300">
            6 Jan 2019
            {/* {activeMembership?.createdAt ? formatDate(new Date(activeMembership.createdAt)) : ''} */}
          </Text>
        </Details>

        <Details>
          <Text variant="t100" secondary>
            Num. of channels
          </Text>
          <Text variant="t300">
            {typeof activeMembership?.channels.length === 'number'
              ? formatNumberShort(activeMembership?.channels.length)
              : ''}
          </Text>
        </Details>

        <Anchor
          as="a"
          variant="t300-strong"
          href={`${PIONEER_URL}/#/members/${handle}`}
          target="_blank"
          color={cVar('colorCoreBlue300')}
        >
          Learn more
        </Anchor>
      </GridItem>
    </StyledLayoutGrid>
  )
}
