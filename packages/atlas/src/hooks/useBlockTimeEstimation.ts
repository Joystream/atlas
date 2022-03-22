import { useCallback } from 'react'

import { useJoystream } from '@/providers/joystream'

const ESTIMATED_BLOCK_TIME_MS = 6000

export const useBlockTimeEstimation = () => {
  const { currentBlock, getCurrentBlockMsTimestamp } = useJoystream()

  const convertBlockToMsTimestamp = useCallback(
    (targetBlock: number) => {
      const nowMs = Date.now()
      const deltaBlocks = targetBlock - currentBlock
      const msSinceLastBlock = nowMs - getCurrentBlockMsTimestamp()

      const deltaMs = deltaBlocks * ESTIMATED_BLOCK_TIME_MS - msSinceLastBlock
      const targetTimestamp = nowMs + deltaMs

      return targetTimestamp
    },
    [currentBlock, getCurrentBlockMsTimestamp]
  )

  const convertMsTimestampToBlock = useCallback(
    (targetTimestamp: number) => {
      if (!targetTimestamp) {
        return
      }
      const deltaMs = targetTimestamp - getCurrentBlockMsTimestamp()

      const deltaBlocks = Math.round(deltaMs / ESTIMATED_BLOCK_TIME_MS)
      const targetBlock = currentBlock + deltaBlocks

      return targetBlock
    },
    [currentBlock, getCurrentBlockMsTimestamp]
  )

  const convertDurationToBlocks = useCallback((milliseconds: number) => {
    return Math.round(milliseconds / ESTIMATED_BLOCK_TIME_MS)
  }, [])

  return {
    convertBlockToMsTimestamp,
    convertMsTimestampToBlock,
    convertDurationToBlocks,
  }
}
