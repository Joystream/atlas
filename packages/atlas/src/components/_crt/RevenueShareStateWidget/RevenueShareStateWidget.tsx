import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { formatDateTime, formatDurationShort } from '@/utils/time'

export const RevenueShareStateWidget = ({ end }: { end?: Date }) => {
  const status: 'active' | 'past' | 'inactive' = !end ? 'inactive' : end.getTime() < Date.now() ? 'past' : 'active'

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
        status !== 'inactive' && end ? (
          status === 'past' ? (
            <Text variant="h500" as="h5" margin={{ bottom: 4 }}>
              {formatDateTime(end).replace(',', ' at')}
            </Text>
          ) : (
            <FlexBox flow="column">
              <Text variant="h500" as="h5">
                {formatDurationShort(Math.round((end.getTime() - Date.now()) / 1000))}
              </Text>
              <Text variant="t100" as="p" color="colorText">
                {formatDateTime(end).replace(',', ' at')}
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
