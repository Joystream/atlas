import styled from '@emotion/styled'
import BN from 'bn.js'
import { ReactNode } from 'react'

import { useBasicChannel } from '@/api/hooks/channel'
import { useMemberships } from '@/api/hooks/membership'
import { GetBasicChannelsQuery } from '@/api/queries/__generated__/channels.generated'
import { BasicMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { Avatar } from '@/components/Avatar'
import { DateTimeBlock } from '@/components/DateTimeBlock'
import { FlexBox } from '@/components/FlexBox'
import {
  SenderItem,
  StyledJoyTokenIcon,
  StyledLink,
  StyledNumberFormat,
} from '@/components/TablePaymentsHistory/TablePaymentsHistory.styles'
import { Text, TextVariant } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { SentryLogger } from '@/utils/logs'

export const DateBlockCell = DateTimeBlock

export const ChannelCell = ({ channel }: { channel?: GetBasicChannelsQuery['channels'][number] }) => {
  return (
    <StyledLink to={absoluteRoutes.viewer.channel(channel?.id)}>
      <SenderItem
        nodeStart={<Avatar assetUrls={channel?.avatarPhoto?.resolvedUrls} size={32} />}
        label={channel?.title}
        isInteractive={false}
      />
    </StyledLink>
  )
}

export const LoadingChannelCell = ({ channelId }: { channelId: string }) => {
  const { channel, loading } = useBasicChannel(channelId, {
    onError: (error) => SentryLogger.error('Failed to fetch memberships', 'ActiveUserProvider', error),
  })

  if (loading) {
    return (
      <FlexBox alignItems="center" gap={2}>
        <SkeletonLoader rounded width={32} height={32} />
        <SkeletonLoader height={16} width="40%" />
      </FlexBox>
    )
  }

  return <ChannelCell channel={channel} />
}

export const MemberCell = ({
  member,
  additionalNode,
  flow = 'row',
}: {
  member?: BasicMembershipFieldsFragment
  additionalNode?: ReactNode
  flow?: 'row' | 'column'
}) => {
  const { urls } = getMemberAvatar(member)
  return (
    <FlexBox alignItems="center" gap={2}>
      <Avatar assetUrls={urls} />
      <HandleContainer flow={flow} justifyContent="start" gap={flow === 'row' ? 2 : 0}>
        <Text variant="t200-strong" as="p" color="colorText" truncate>
          {member?.handle ?? 'Unknown'}
        </Text>
        {additionalNode}
      </HandleContainer>
    </FlexBox>
  )
}

export const LoadingMemberRow = ({
  memberId,
  additionalNode,
  flow,
}: {
  memberId: string
  additionalNode?: ReactNode
  flow?: 'row' | 'column'
}) => {
  const { loading, memberships } = useMemberships({
    where: {
      id_eq: memberId,
    },
  })

  if (loading) {
    return (
      <FlexBox alignItems="center" gap={2}>
        <SkeletonLoader rounded width={32} height={32} />
        <SkeletonLoader height={16} width="40%" />
      </FlexBox>
    )
  }

  const member = memberships?.[0]

  return <MemberCell member={member} additionalNode={additionalNode} flow={flow} />
}

const HandleContainer = styled(FlexBox)`
  overflow: hidden;
`

export const TokenAmount = ({ tokenAmount, variant }: { tokenAmount: BN | number; variant?: TextVariant }) => {
  const isNegative = typeof tokenAmount === 'number' ? tokenAmount < 0 : tokenAmount.isNeg()
  return (
    <StyledNumberFormat
      icon={<StyledJoyTokenIcon variant="gray" error={isNegative} />}
      variant={variant ?? 't200-strong'}
      as="p"
      value={tokenAmount}
      format="short"
      color={isNegative ? 'colorTextError' : 'colorTextStrong'}
      withDenomination
    />
  )
}
