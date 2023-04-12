import { useCallback } from 'react'

import { useJoystreamStore } from '@/providers/joystream/joystream.store'

export const ESTIMATED_BLOCK_TIME_MS = 6000

export const useBlockTimeEstimation = () => {
  const { currentBlock, currentBlockMsTimestamp } = useJoystreamStore()

  const convertBlockToMsTimestamp = useCallback(
    (targetBlock: number) => {
      if (!currentBlockMsTimestamp) {
        return
      }
      const nowMs = Date.now()
      const deltaBlocks = targetBlock - currentBlock
      const msSinceLastBlock = nowMs - currentBlockMsTimestamp

      const deltaMs = deltaBlocks * ESTIMATED_BLOCK_TIME_MS - msSinceLastBlock
      const targetTimestamp = nowMs + deltaMs

      return targetTimestamp
    },
    [currentBlock, currentBlockMsTimestamp]
  )

  const convertMsTimestampToBlock = useCallback(
    (targetTimestamp: number) => {
      if (!targetTimestamp) {
        return
      }
      const deltaMs = targetTimestamp - currentBlockMsTimestamp

      const deltaBlocks = Math.round(deltaMs / ESTIMATED_BLOCK_TIME_MS)
      const targetBlock = currentBlock + deltaBlocks

      return targetBlock
    },
    [currentBlock, currentBlockMsTimestamp]
  )

  const convertDurationToBlocks = useCallback((milliseconds: number) => {
    return Math.round(milliseconds / ESTIMATED_BLOCK_TIME_MS)
  }, [])

  const convertBlocksToDuration = useCallback((blocks: number) => {
    return blocks * ESTIMATED_BLOCK_TIME_MS
  }, [])

  return {
    convertBlockToMsTimestamp,
    convertMsTimestampToBlock,
    convertDurationToBlocks,
    convertBlocksToDuration,
  }
}
