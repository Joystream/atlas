import { useMemo } from 'react'

import { useBasicChannel } from '@/api/hooks/channel'
import { Avatar } from '@/components/Avatar'
import { Pill } from '@/components/Pill'
import { Table, TableProps } from '@/components/Table'
import { SenderItem, StyledLink } from '@/components/TablePaymentsHistory/TablePaymentsHistory.styles'
import { Text } from '@/components/Text'
import { LeftAlignText, RightAlignText } from '@/components/YppReferralTable/YppReferralTable.styles'
import { absoluteRoutes } from '@/config/routes'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { SentryLogger } from '@/utils/logs'
import { formatNumber } from '@/utils/number'
import { formatDateTime } from '@/utils/time'
import { TierDescription, TierWrapper } from '@/views/studio/YppDashboard/YppDashboard.styles'

import { COLUMNS, tableLoadingData } from './YppReferralTable.utils'

export type YppReferral = {
  date: Date
  channel: string
  tier: number
  rewardUsd: number
  status: 'Unverified' | 'Suspended' | 'Verified'
}

type YppReferralTableProps = {
  isLoading: boolean
  data: YppReferral[]
}

export const YppReferralTable = ({ isLoading, data }: YppReferralTableProps) => {
  const mappedData: TableProps['data'] = useMemo(
    () =>
      data.map((entry) => ({
        date: <RegDate date={entry.date} />,
        channel: <Channel channel={entry.channel} />,
        tier: <Tier tier={entry.tier} />,
        status: <Status status={entry.status} />,
        reward: <Reward reward={entry.rewardUsd} />,
      })),
    [data]
  )
  return <Table title="Channels you referred" columns={COLUMNS} data={isLoading ? tableLoadingData : mappedData} />
}

const RegDate = ({ date }: { date: Date }) => {
  const { convertMsTimestampToBlock } = useBlockTimeEstimation()
  return (
    <>
      <Text as="p" variant="t200-strong">
        {formatDateTime(date)}
      </Text>
      <Text as="p" variant="t100" margin={{ top: 1 }} color="colorText">
        {formatNumber(convertMsTimestampToBlock(date.getTime()) || 0)} block
      </Text>
    </>
  )
}

const Channel = ({ channel }: { channel: YppReferral['channel'] }) => {
  const { extendedChannel, loading } = useBasicChannel(channel, {
    onError: (error) => SentryLogger.error('Failed to fetch memberships', 'ActiveUserProvider', error),
  })

  return (
    <StyledLink to={absoluteRoutes.viewer.channel(extendedChannel?.channel.id)}>
      <SenderItem
        nodeStart={
          <Avatar assetUrls={extendedChannel?.channel.avatarPhoto?.resolvedUrls} size={32} loading={loading} />
        }
        label={extendedChannel?.channel.title}
        isInteractive={false}
      />
    </StyledLink>
  )
}

const Tier = ({ tier }: { tier: number }) => {
  return (
    <TierWrapper>
      {/*{TIERS[tier].icon}*/}
      <TierDescription>
        <div style={{ display: 'grid' }}>
          <LeftAlignText variant="h300" as="span">
            Tier
          </LeftAlignText>
          <Text variant="t100" as="p" color="colorText" />
        </div>
      </TierDescription>
    </TierWrapper>
  )
}

const Reward = ({ reward }: { reward: number }) => {
  return (
    <RightAlignText as="p" variant="t100-strong">
      ${reward}
    </RightAlignText>
  )
}

const Status = ({ status }: { status: 'Unverified' | 'Suspended' | 'Verified' }) => (
  <Pill variant={status === 'Verified' ? 'success' : 'default'} label={status} />
)
