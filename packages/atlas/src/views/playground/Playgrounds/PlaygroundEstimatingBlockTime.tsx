import { formatDistanceToNowStrict } from 'date-fns'
import { useState } from 'react'

import { Text } from '@/components/Text'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'
import { useJoystreamStore } from '@/providers/joystream'

export const PlaygroundEstimatingBlockTime = () => {
  const [datetimeLocal, setDatetimeLocal] = useState('')
  const [blockNumber, setBlockNumber] = useState(0)

  const { currentBlock } = useJoystreamStore()
  const { convertBlockToMsTimestamp, convertMsTimestampToBlock } = useBlockTimeEstimation()
  const msTimestamp = useMsTimestamp()

  const blockNumberMsTimeStamp = convertBlockToMsTimestamp(blockNumber)

  return (
    <div>
      <div>
        <Text as="p" variant="h700">
          Current state
        </Text>
        <Text as="p" variant="h300">
          Current block number: {currentBlock}
        </Text>
        <Text as="p" variant="h300">
          Current time: {new Date(msTimestamp).toLocaleString()}
        </Text>
      </div>
      <br />
      <div>
        <Text as="p" variant="h700">
          Convert block to time
        </Text>
        <FormField label="Change number of block">
          <Input
            type="number"
            value={String(blockNumber)}
            onChange={(e) => setBlockNumber(Number(e.currentTarget.value))}
          />
        </FormField>
        <Text as="p" variant="h500">
          Results:
        </Text>
        <Text as="p" variant="h300">
          Block number: {blockNumber}
        </Text>
        <Text as="p" variant="h300">
          Date: {blockNumberMsTimeStamp ? new Date(blockNumberMsTimeStamp).toLocaleString() : null}{' '}
        </Text>
        <Text as="p" variant="h300">
          Timeleft:{' '}
          {blockNumberMsTimeStamp
            ? formatDistanceToNowStrict(new Date(blockNumberMsTimeStamp), { addSuffix: true })
            : null}{' '}
        </Text>
      </div>
      <br />
      <div>
        <Text as="p" variant="h700">
          Convert time to block
        </Text>
        <FormField label="Change date">
          <input
            type="datetime-local"
            step={1}
            value={datetimeLocal}
            onChange={(e) => setDatetimeLocal(e.currentTarget.value)}
          />
        </FormField>
        <Text as="p" variant="h500">
          Results:
        </Text>
        <Text as="p" variant="h300">
          Block number: {convertMsTimestampToBlock(Date.parse(datetimeLocal))}
        </Text>
        <Text as="p" variant="h300">
          Date: {datetimeLocal}
        </Text>
      </div>
    </div>
  )
}
