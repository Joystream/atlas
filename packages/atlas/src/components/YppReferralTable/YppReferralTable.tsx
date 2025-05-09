import { useMemo } from 'react'

import { FlexBox } from '@/components/FlexBox'
import { Table, TableProps } from '@/components/Table'
import { DateBlockCell, LoadingChannelCell } from '@/components/Table/Table.cells'
import { Text } from '@/components/Text'
import { RightAlignText, TierWrapper } from '@/components/YppReferralTable/YppReferralTable.styles'
import { getTierIcon } from '@/components/_ypp/YppDashboardTier'
import { atlasConfig } from '@/config'
import { convertUpperCamelToSentence } from '@/utils/misc'
import { BOOST_TIMESTAMP, getTierRewards, yppBackendTierToConfig } from '@/utils/ypp'
import { YppChannelStatus } from '@/views/global/YppLandingView/YppLandingView.types'

import { COLUMNS, tableLoadingData } from './YppReferralTable.utils'

export type YppReferral = {
  date: Date
  channelId: string
  status: YppChannelStatus
}

type YppReferralTableProps = {
  isLoading: boolean
  data: YppReferral[]
} & Pick<TableProps, 'pagination'>

export const YppReferralTable = ({ isLoading, data, pagination }: YppReferralTableProps) => {
  const mappedData: TableProps['data'] = useMemo(
    () =>
      data.map((entry) => ({
        date: <DateBlockCell type="date" date={entry.date} />,
        channel: <LoadingChannelCell channelId={entry.channelId} />,
        tier: <Tier yppStatus={entry.status} />,
        reward: <Reward yppStatus={entry.status} signupTimestamp={entry.date.getTime()} />,
      })),
    [data]
  )
  return (
    <Table
      minWidth={700}
      title="Channels you referred"
      columns={COLUMNS}
      data={isLoading ? tableLoadingData : mappedData}
      pagination={pagination}
      pageSize={pagination?.itemsPerPage}
    />
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

const Reward = ({ yppStatus, signupTimestamp }: { yppStatus: YppChannelStatus; signupTimestamp: number }) => {
  const multiplier =
    yppBackendTierToConfig(yppStatus) !== 'bronze' && signupTimestamp > BOOST_TIMESTAMP
      ? atlasConfig.features.ypp.tierBoostMultiplier || 1
      : 1
  return (
    <RightAlignText as="p" variant="t100-strong">
      {yppStatus.startsWith('Suspended')
        ? 'Not paid'
        : yppStatus === 'Unverified'
        ? 'Pending'
        : yppStatus.startsWith('Verified')
        ? `$${(getTierRewards(yppBackendTierToConfig(yppStatus))?.referral || 0) * multiplier}`
        : 'n/a'}
    </RightAlignText>
  )
}
