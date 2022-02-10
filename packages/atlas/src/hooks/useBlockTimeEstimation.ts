import { useEffect, useState } from 'react'

import { useJoystream } from '@/providers/joystream'

const ESTIMATED_BLOCK_TIME = 6000

export const useBlockTimeEstimation = () => {
  const { joystream, proxyCallback } = useJoystream()

  const [currentBlock, setCurrentBlock] = useState(0)
  const [timeofTheLastBlock, setTimeOfTheLastBlock] = useState(0)

  useEffect(() => {
    if (!joystream) {
      return
    }

    let unsubscribe
    const init = async () => {
      unsubscribe = await joystream.subscribeCurrentBlock(
        proxyCallback((number) => {
          setCurrentBlock(number)
          setTimeOfTheLastBlock(Date.now())
        })
      )
    }
    init()

    return unsubscribe
  }, [joystream, proxyCallback])

  const convertBlockToDate = (block: number) => {
    const now = Date.now()
    const differenceBetweenProvidedBlockAndCurrentBlock = block - currentBlock
    const differenceBetweenNowAndTimeofTheLastBlock = now - timeofTheLastBlock

    const estimatedTime =
      differenceBetweenProvidedBlockAndCurrentBlock * ESTIMATED_BLOCK_TIME - differenceBetweenNowAndTimeofTheLastBlock
    const date = now + estimatedTime

    return date
  }

  const convertDateToBlock = (date: number) => {
    if (!date) {
      return
    }
    const timeOfTheFirstBlock = convertBlockToDate(0)

    const differenceBetweenTimeofTheFirstBlockAndDate = date - timeOfTheFirstBlock

    const block = Math.round(differenceBetweenTimeofTheFirstBlockAndDate / ESTIMATED_BLOCK_TIME)

    return block
  }

  return { currentBlock, timeofTheLastBlock, convertBlockToDate, convertDateToBlock }
}
