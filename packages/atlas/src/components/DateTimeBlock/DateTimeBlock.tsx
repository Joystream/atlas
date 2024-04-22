import { FC } from 'react'

import { Text } from '@/components/Text'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { formatNumber } from '@/utils/number'
import { formatDateTime } from '@/utils/time'

export type DateProps = { type: 'date'; date: Date }
export type BlocksProps = { type: 'block'; block: number }

export type DateTimeBlockProps = DateProps | BlocksProps

export const DateTimeBlock: FC<DateTimeBlockProps> = (props) => {
  const { convertMsTimestampToBlock, convertBlockToMsTimestamp } = useBlockTimeEstimation()
  return (
    <>
      <Text as="p" variant="t200-strong">
        {props.type === 'date'
          ? formatDateTime(props.date)
          : formatDateTime(new Date(convertBlockToMsTimestamp(props.block) ?? 0))}
      </Text>
      <Text as="p" variant="t100" margin={{ top: 1 }} color="colorText">
        {props.type === 'date' ? formatNumber(convertMsTimestampToBlock(props.date.getTime()) || 0) : props.block} block
      </Text>
    </>
  )
}
