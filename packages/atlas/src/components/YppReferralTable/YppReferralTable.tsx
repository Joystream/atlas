import { useMemo } from 'react'

import { Table, TableProps } from '@/components/Table'
import { DateBlockCell, LoadingChannelCell } from '@/components/Table/Table.cells'
import { Text } from '@/components/Text'
import { TierText } from '@/components/YppReferralTable/YppReferralTable.styles'
import { TIERS } from '@/views/studio/YppDashboard/YppDashboard.config'
import { TierDescription, TierWrapper } from '@/views/studio/YppDashboard/YppDashboard.styles'

import { COLUMNS, tableLoadingData } from './YppReferralTable.utils'

export type YppReferral = {
  date: Date
  channelId: string
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
        date: <DateBlockCell type="date" date={entry.date} />,
        channel: <LoadingChannelCell channelId={entry.channelId} />,
        tier: <Tier subscribers={entry.subscribers} />,
      })),
    [data]
  )
  return <Table title="Channels you referred" columns={COLUMNS} data={isLoading ? tableLoadingData : mappedData} />
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
