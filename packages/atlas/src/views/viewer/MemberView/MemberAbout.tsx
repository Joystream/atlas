import { GetMembershipsQuery } from '@/api/queries/__generated__/memberships.generated'
import { EmptyFallback } from '@/components/EmptyFallback'
import { GridItem } from '@/components/LayoutGrid/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { ChannelCard } from '@/components/_channel/ChannelCard'
import { atlasConfig } from '@/config'
import { createPlaceholderData } from '@/utils/data'
import { formatDate } from '@/utils/time'

import { Anchor, ChannelsOwnedContainerGrid, Details, StyledLayoutGrid, TextContainer } from './MemberAbout.styles'

type MemberAboutProps = {
  member?: GetMembershipsQuery['memberships'][number]
  loading: boolean
}
export const MemberAbout = ({ member, loading }: MemberAboutProps) => {
  const placeholderItems = createPlaceholderData(2).map((_, idx) => <ChannelCard key={idx} loading={loading} />)

  const channels = loading
    ? placeholderItems
    : member?.channels.map((channel) => <ChannelCard key={channel.id} withFollowButton={false} channel={channel} />)

  return (
    <StyledLayoutGrid>
      <GridItem colSpan={{ base: 12, sm: 8 }} rowStart={{ base: 2, sm: 1 }}>
        {!!member?.metadata?.about && (
          <TextContainer withDivider={!!member?.channels.length}>
            <Text as="h2" variant="h500">
              About me
            </Text>
            <Text as="p" variant="t300" color="colorText">
              {member.metadata.about}
            </Text>
          </TextContainer>
        )}

        <div>
          <Text as="h2" variant="h500">
            Channels owned
          </Text>
          {channels?.length ? (
            <ChannelsOwnedContainerGrid>{channels}</ChannelsOwnedContainerGrid>
          ) : (
            <EmptyFallback title="No channels" subtitle="This member hasn't created any channels yet." />
          )}
        </div>
      </GridItem>
      <GridItem colSpan={{ base: 12, sm: 3 }} colStart={{ sm: -4 }}>
        <Text as="h3" variant="h500" margin={{ bottom: 4 }}>
          Details
        </Text>

        <Details>
          <Text as="p" variant="t100" color="colorText">
            Join date
          </Text>
          <Text as="span" variant="t300">
            {member?.createdAt ? formatDate(new Date(member.createdAt)) : ''}
          </Text>
        </Details>

        <Details>
          <Text as="p" variant="t100" color="colorText">
            Num. of channels
          </Text>
          <NumberFormat
            as="span"
            format="short"
            value={member?.channels.length ? member?.channels.length : 0}
            variant="t300"
          />
        </Details>

        <Anchor
          as="a"
          variant="t300-strong"
          href={`${atlasConfig.general.pioneerMemberUrlPrefix}/${member?.id}`}
          target="_blank"
          color="colorTextPrimary"
        >
          Learn more
        </Anchor>
      </GridItem>
    </StyledLayoutGrid>
  )
}
