import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { formatDateTime, formatDurationShort } from '@/utils/time'

export const RevenueShareStateWidget = ({ endsAtBlock }: { endsAtBlock?: number }) => {
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()
  const status: 'active' | 'past' | 'inactive' = !endsAtBlock ? 'inactive' : endsAtBlock < 0 ? 'past' : 'active'
  const endingBlockTimestamp = convertBlockToMsTimestamp(endsAtBlock ?? 0)
  const endingDate = endingBlockTimestamp ? new Date(endingBlockTimestamp) : new Date()
  return (
    <WidgetTile
      title={
        status === 'inactive'
          ? 'REVENUE SHARE STATE'
          : status === 'past'
          ? 'REVENUE SHARE ENDED ON'
          : 'REVENUE SHARE ENDS IN'
      }
      customNode={
        status !== 'inactive' && endsAtBlock ? (
          status === 'past' ? (
            <Text variant="h500" as="h5" margin={{ bottom: 4 }}>
              {formatDateTime(endingDate).replace(',', ' at')}
            </Text>
          ) : (
            <FlexBox flow="column">
              <Text variant="h500" as="h5">
                {formatDurationShort(Math.round((endingDate.getTime() - Date.now()) / 1000))}
              </Text>
              <Text variant="t100" as="p" color="colorText">
                {formatDateTime(endingDate).replace(',', ' at')}
              </Text>
            </FlexBox>
          )
        ) : (
          <Text variant="h500" as="h5" margin={{ bottom: 4 }}>
            No active share
          </Text>
        )
      }
      tooltip={{
        text: 'Lorem ipsum',
      }}
    />
  )
}
