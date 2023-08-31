import { FC } from 'react'

import { Text } from '@/components/Text'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { formatNumber } from '@/utils/number'
import { formatDateTime } from '@/utils/time'

export type DateTimeBlockProps = { date: Date }
export const DateTimeBlock: FC<DateTimeBlockProps> = ({ date }) => {
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
