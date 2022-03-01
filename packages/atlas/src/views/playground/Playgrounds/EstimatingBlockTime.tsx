import { formatDistanceToNowStrict } from 'date-fns'
import React, { useState } from 'react'

import { Text } from '@/components/Text'
import { FormField } from '@/components/_inputs/FormField'
import { TextField } from '@/components/_inputs/TextField'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useMsTimestamp } from '@/hooks/useMsTimestamp'
import { useJoystream } from '@/providers/joystream'

export const EstimatingBlockTime = () => {
  const [datetimeLocal, setDatetimeLocal] = useState('')
  const [blockNumber, setBlockNumber] = useState(0)

  const { getCurrentBlock } = useJoystream()
  const { convertBlockToMsTimestamp, convertMsTimestampToBlock } = useBlockTimeEstimation()
  const msTimestamp = useMsTimestamp()

  return (
    <div>
      <div>
        <Text variant="h700">Current state</Text>
        <Text variant="h300">Current block number: {getCurrentBlock()}</Text>
        <Text variant="h300">Current time: {new Date(msTimestamp).toLocaleString()}</Text>
      </div>
      <br />
      <div>
        <Text variant="h700">Convert block to time</Text>
        <FormField title="Change number of block">
          <TextField
            type="number"
            value={String(blockNumber)}
            onChange={(e) => setBlockNumber(Number(e.currentTarget.value))}
          />
        </FormField>
        <Text variant="h500">Results:</Text>
        <Text variant="h300">Block number: {blockNumber}</Text>
        <Text variant="h300">Date: {new Date(convertBlockToMsTimestamp(blockNumber)).toLocaleString()} </Text>
        <Text variant="h300">
          Timeleft: {formatDistanceToNowStrict(new Date(convertBlockToMsTimestamp(blockNumber)), { addSuffix: true })}{' '}
        </Text>
      </div>
      <br />
      <div>
        <Text variant="h700">Convert time to block</Text>
        <FormField title="Change date">
          <input
            type="datetime-local"
            step={1}
            value={datetimeLocal}
            onChange={(e) => setDatetimeLocal(e.currentTarget.value)}
          />
        </FormField>
        <Text variant="h500">Results:</Text>
        <Text variant="h300">Block number: {convertMsTimestampToBlock(Date.parse(datetimeLocal))}</Text>
        <Text variant="h300">Date: {datetimeLocal}</Text>
      </div>
    </div>
  )
}
