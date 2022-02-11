import { useEffect, useRef } from 'react'

import { useJoystream } from '@/providers/joystream'

const ESTIMATED_BLOCK_TIME = 6000

export const useBlockTimeEstimation = () => {
  const { joystream, proxyCallback } = useJoystream()
  const currentBlockRef = useRef(0)
  const timeofTheLastBlockRef = useRef(0)

  useEffect(() => {
    if (!joystream) {
      return
    }

    let unsubscribe
    const init = async () => {
      unsubscribe = await joystream.subscribeCurrentBlock(
        proxyCallback((number) => {
          currentBlockRef.current = number
          timeofTheLastBlockRef.current = Date.now()
        })
      )
    }
    init()

    return unsubscribe
  }, [joystream, proxyCallback])

  const convertBlockToDate = useRef((block: number) => {
    const now = Date.now()
    const differenceBetweenProvidedBlockAndCurrentBlock = block - currentBlockRef.current
    const differenceBetweenNowAndTimeofTheLastBlock = now - timeofTheLastBlockRef.current

    const estimatedTime =
      differenceBetweenProvidedBlockAndCurrentBlock * ESTIMATED_BLOCK_TIME - differenceBetweenNowAndTimeofTheLastBlock
    const date = now + estimatedTime

    return date
  })

  const convertDateToBlock = useRef((date: number) => {
    if (!date) {
      return
    }
    const timeOfTheFirstBlock = convertBlockToDate.current(0)

    const differenceBetweenTimeofTheFirstBlockAndDate = date - timeOfTheFirstBlock

    const block = Math.round(differenceBetweenTimeofTheFirstBlockAndDate / ESTIMATED_BLOCK_TIME)

    return block
  })

  return {
    currentBlock: currentBlockRef.current,
    timeofTheLastBlock: timeofTheLastBlockRef.current,
    convertBlockToDate: convertBlockToDate.current,
    convertDateToBlock: convertDateToBlock.current,
  }
}
