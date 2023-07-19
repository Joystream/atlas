import BN from 'bn.js'
import { useMemo } from 'react'

import { useBasicChannel } from '@/api/hooks/channel'
import { Avatar } from '@/components/Avatar'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Table, TableProps } from '@/components/Table'
import { SenderItem, StyledLink } from '@/components/TablePaymentsHistory/TablePaymentsHistory.styles'
import { Text } from '@/components/Text'
import { RewardWrapper, TierText } from '@/components/YppReferralTable/YppReferralTable.styles'
import { absoluteRoutes } from '@/config/routes'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { SentryLogger } from '@/utils/logs'
import { formatNumber } from '@/utils/number'
import { formatDateTime } from '@/utils/time'
import { TIERS } from '@/views/studio/YppDashboard/YppDashboard.config'
import { TierDescription, TierWrapper } from '@/views/studio/YppDashboard/YppDashboard.styles'

import { COLUMNS, tableLoadingData } from './YppReferralTable.utils'

type YppReferral = {
  date: Date
  channel: string
  tier: number
  reward: BN
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
        tier: <Tier tier={entry.tier} />,
        reward: (
          <RewardWrapper>
            <NumberFormat
              icon={<JoyTokenIcon variant="gray" />}
              variant="t200-strong"
              as="p"
              value={entry.reward}
              margin={{ left: 1 }}
              format="short"
              withDenomination
              denominationAlign="right"
            />
          </RewardWrapper>
        ),
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

const Tier = ({ tier }: { tier: number }) => {
  return (
    <TierWrapper>
      {TIERS[tier].icon}
      <TierDescription>
        <div style={{ display: 'grid' }}>
          <TierText variant="h300" as="span">
            Tier {tier + 1}{' '}
          </TierText>
          <Text variant="t100" as="p" color="colorText">
            {TIERS[tier].rules}
          </Text>
        </div>
      </TierDescription>
    </TierWrapper>
  )
}
