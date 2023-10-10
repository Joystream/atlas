import { useMemo } from 'react'

import { useBasicChannel } from '@/api/hooks/channel'
import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { Table, TableProps } from '@/components/Table'
import { SenderItem, StyledLink } from '@/components/TablePaymentsHistory/TablePaymentsHistory.styles'
import { Text } from '@/components/Text'
import { RightAlignText, TierWrapper } from '@/components/YppReferralTable/YppReferralTable.styles'
import { getTierIcon } from '@/components/_ypp/YppDashboardTier'
import { absoluteRoutes } from '@/config/routes'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { SentryLogger } from '@/utils/logs'
import { convertUpperCamelToSentence } from '@/utils/misc'
import { formatNumber } from '@/utils/number'
import { formatDateTime } from '@/utils/time'
import { getTierRewards, yppBackendTierToConfig } from '@/utils/ypp'
import { YppChannelStatus } from '@/views/global/YppLandingView/YppLandingView.types'

import { COLUMNS, tableLoadingData } from './YppReferralTable.utils'

export type YppReferral = {
  date: Date
  channel: string
  status: YppChannelStatus
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
        tier: <Tier yppStatus={entry.status} />,
        reward: <Reward yppStatus={entry.status} />,
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

const Tier = ({ yppStatus }: { yppStatus: YppChannelStatus }) => {
  return (
    <TierWrapper gap={2} alignItems="center">
      {getTierIcon(yppStatus, true)}
      <FlexBox flow="column" width="fit-content" gap={1}>
        <Text variant="t100" as="p">
          {yppStatus.startsWith('Verified')
            ? `${yppStatus.split('::')[1] || 'N/A'} tier`
            : yppStatus.startsWith('Suspended')
            ? 'Suspended'
            : yppStatus === 'Unverified'
            ? 'Unverified'
            : 'Opted out'}
        </Text>
        <Text variant="t100" as="p" color="colorText">
          {yppStatus === 'Unverified'
            ? 'May take up to 48 hours'
            : yppStatus.startsWith('Verified')
            ? 'Verified'
            : yppStatus.startsWith('Suspended')
            ? `Reason: ${convertUpperCamelToSentence(yppStatus.split('::')[1])}`
            : 'Sync paused'}
        </Text>
      </FlexBox>
    </TierWrapper>
  )
}

const Reward = ({ yppStatus }: { yppStatus: YppChannelStatus }) => {
  return (
    <RightAlignText as="p" variant="t100-strong">
      {yppStatus.startsWith('Suspended')
        ? 'Not paid'
        : yppStatus === 'Unverified'
        ? 'Pending'
        : yppStatus.startsWith('Verified')
        ? `$${getTierRewards(yppBackendTierToConfig(yppStatus))?.referral}`
        : 'n/a'}
    </RightAlignText>
  )
}
