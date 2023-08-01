import { useMemo } from 'react'

import { useBasicChannel } from '@/api/hooks/channel'
import { Avatar } from '@/components/Avatar'
import { Table, TableProps } from '@/components/Table'
import { SenderItem, StyledLink } from '@/components/TablePaymentsHistory/TablePaymentsHistory.styles'
import { Text } from '@/components/Text'
import { TierText } from '@/components/YppReferralTable/YppReferralTable.styles'
import { absoluteRoutes } from '@/config/routes'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { SentryLogger } from '@/utils/logs'
import { formatNumber } from '@/utils/number'
import { formatDateTime } from '@/utils/time'
import { TIERS } from '@/views/studio/YppDashboard/YppDashboard.config'
import { TierDescription, TierWrapper } from '@/views/studio/YppDashboard/YppDashboard.styles'

import { COLUMNS, tableLoadingData } from './YppReferralTable.utils'

export type YppReferral = {
  date: Date
  channel: string
  subscribers: number
}

type YppReferralTableProps = {
  isLoading: boolean
  data: YppReferral[]
}

export const YppReferralTable = ({ isLoading, data }: YppReferralTableProps) => {
  const mappedData: TableProps['data'] = useMemo(
    () =>
      data.map((entry) => ({
        date: <Date date={entry.date} />,
        channel: <Channel channel={entry.channel} />,
        tier: <Tier subscribers={entry.subscribers} />,
      })),
    [data]
  )
  return <Table title="Channels you referred" columns={COLUMNS} data={isLoading ? tableLoadingData : mappedData} />
}

const Date = ({ date }: { date: Date }) => {
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

const Tier = ({ subscribers }: { subscribers: number }) => {
  const currentTier = TIERS.reduce((prev, current, idx) => {
    if (subscribers >= (current?.subscribers || 0)) {
      return idx
    } else {
      return prev
    }
  }, 0)
  return (
    <TierWrapper>
      {TIERS[currentTier].icon}
      <TierDescription>
        <div style={{ display: 'grid' }}>
          <TierText variant="h300" as="span">
            Tier {currentTier + 1}{' '}
          </TierText>
          <Text variant="t100" as="p" color="colorText">
            {TIERS[currentTier].rules}
          </Text>
        </div>
      </TierDescription>
    </TierWrapper>
  )
}
