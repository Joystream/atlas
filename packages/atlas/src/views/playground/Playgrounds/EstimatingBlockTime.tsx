import { formatDistanceToNowStrict } from 'date-fns'
import React, { useEffect, useState } from 'react'

import { Text } from '@/components/Text'
import { FormField } from '@/components/_inputs/FormField'
import { TextField } from '@/components/_inputs/TextField'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'

export const EstimatingBlockTime = () => {
  const [datetimeLocal, setDatetimeLocal] = useState('')
  const [blockNumber, setBlockNumber] = useState(0)
  const [currentBlock, setCurrentBlock] = useState<number>()

  const [currentTime, setCurrentTime] = useState(new Date())

  const { convertBlockToDate, convertDateToBlock } = useBlockTimeEstimation()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      setCurrentBlock(convertDateToBlock(Date.now()))
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [convertDateToBlock])

  return (
    <div>
      <div>
        <Text variant="h700">Current state</Text>
        <Text variant="h300">Current block number: {currentBlock}</Text>
        <Text variant="h300">Current time: {new Date(currentTime).toLocaleString()}</Text>
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
        <Text variant="h300">Date: {new Date(convertBlockToDate(blockNumber)).toLocaleString()} </Text>
        <Text variant="h300">
          Timeleft: {formatDistanceToNowStrict(new Date(convertBlockToDate(blockNumber)), { addSuffix: true })}{' '}
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
        <Text variant="h300">Block number: {convertDateToBlock(Date.parse(datetimeLocal))}</Text>
        <Text variant="h300">Date: {datetimeLocal}</Text>
      </div>
    </div>
  )
}
