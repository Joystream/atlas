import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { formatDateTime, formatDurationShort } from '@/utils/time'

export const RevenueShareStateWidget = ({ endsAtBlock, className }: { endsAtBlock?: number; className?: string }) => {
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()
  const endingBlockTimestamp = convertBlockToMsTimestamp(endsAtBlock ?? 0)
  const endingDate = endingBlockTimestamp ? new Date(endingBlockTimestamp) : null
  const status: 'active' | 'past' | 'inactive' = !endingBlockTimestamp
    ? 'inactive'
    : endingBlockTimestamp < Date.now()
    ? 'past'
    : 'active'

  return (
    <WidgetTile
      className={className}
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
              {endingDate ? formatDateTime(endingDate).replace(',', ' at') : 'N/A'}
            </Text>
          ) : (
            <FlexBox flow="column">
              <Text variant="h500" as="h5">
                {endingDate ? formatDurationShort(Math.round((endingDate.getTime() - Date.now()) / 1000)) : 'N/A'}
              </Text>
              <Text variant="t100" as="p" color="colorText">
                {endingDate ? formatDateTime(endingDate).replace(',', ' at') : 'N/A'}
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
