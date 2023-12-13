import { FlexBox } from '@/components/FlexBox'
import { Text, TextVariant } from '@/components/Text'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'
import { formatDateTimeAt, formatDurationShort } from '@/utils/time'

type CommonProps = {
  mainVariant?: TextVariant
  subVariant?: TextVariant
}

type BlockTextTime = {
  type: 'block'
  atBlock: number
} & CommonProps

type TimestampTextTimer = {
  type: 'timestamp'
  date: Date
} & CommonProps

export type TextTimerProps = TimestampTextTimer | BlockTextTime

/*
 * Timer will:
 *   - above week, display ony date as: 20 September 2042 at 12:00
 *   - under week, timer that will run down default color
 *   - under a day, timer that will run down color red
 */
export const TextTimer = (props: TextTimerProps) => {
  return props.type === 'block' ? <BlockTextTimer {...props} /> : <TimestampTextTimer {...props} />
}

const BlockTextTimer = ({ atBlock, mainVariant, subVariant }: BlockTextTime) => {
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()
  const blockTimestamp = convertBlockToMsTimestamp(atBlock ?? 0)
  const blockDate = blockTimestamp ? new Date(blockTimestamp) : null
  const currentTimestamp = Date.now()
  const daysLeft = blockDate ? (blockDate.getTime() - currentTimestamp) / (1000 * 60 * 60 * 24) : 999
  const isUnderDay = daysLeft <= 1
  const isBelowWeek = daysLeft <= 7
  const isPast = daysLeft <= 0

  if (isPast) {
    return (
      <Text variant={mainVariant ? mainVariant : 'h500'} as="h5">
        {blockDate ? formatDateTimeAt(blockDate) : 'N/A'}
      </Text>
    )
  }

  return (
    <FlexBox flow="column">
      <Text
        variant={mainVariant ? mainVariant : 'h500'}
        as="span"
        color={isUnderDay ? 'colorTextError' : 'colorTextStrong'}
      >
        {blockDate
          ? isBelowWeek
            ? formatDurationShort(Math.round((blockDate.getTime() - currentTimestamp) / 1000))
            : formatDateTimeAt(blockDate)
          : 'N/A'}
      </Text>
      {isBelowWeek && (
        <Text variant={subVariant ? subVariant : 't100'} as="span" color={isUnderDay ? 'colorTextError' : 'colorText'}>
          {isUnderDay ? 'Less than a day' : blockDate ? formatDateTimeAt(blockDate) : 'N/A'}
        </Text>
      )}
    </FlexBox>
  )
}

const TimestampTextTimer = ({ date, subVariant, mainVariant }: TimestampTextTimer) => {
  const currentTimestamp = useMsTimestamp()
  const daysLeft = (date.getTime() - currentTimestamp) / (1000 * 60 * 60 * 24)
  const isUnderDay = daysLeft <= 1
  const isBelowWeek = daysLeft <= 7
  const isPast = daysLeft <= 0

  if (isPast) {
    return (
      <Text variant={mainVariant ? mainVariant : 'h500'} as="span">
        {date ? formatDateTimeAt(date) : 'N/A'}
      </Text>
    )
  }

  return (
    <FlexBox flow="column">
      <Text
        variant={mainVariant ? mainVariant : 'h500'}
        as="span"
        color={isUnderDay ? 'colorTextError' : 'colorTextStrong'}
      >
        {date
          ? isBelowWeek
            ? formatDurationShort(Math.round((date.getTime() - currentTimestamp) / 1000))
            : formatDateTimeAt(date)
          : 'N/A'}
      </Text>
      {isBelowWeek && (
        <Text variant={subVariant ? subVariant : 't100'} as="span" color={isUnderDay ? 'colorTextError' : 'colorText'}>
          {isUnderDay ? 'Less than a day' : date ? formatDateTimeAt(date) : 'N/A'}
        </Text>
      )}
    </FlexBox>
  )
}
