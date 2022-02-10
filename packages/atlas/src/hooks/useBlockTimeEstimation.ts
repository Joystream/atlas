import { useEffect, useState } from 'react'

import { useJoystream } from '@/providers/joystream'

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
    const differenceBetweenProvidedBlockandCurrentBlock = block - currentBlock
    const differenceBetweenNowAndTimeofTheLastBlock = now - timeofTheLastBlock

    const estimatedTime =
      differenceBetweenProvidedBlockandCurrentBlock * 6000 - differenceBetweenNowAndTimeofTheLastBlock
    const date = now + estimatedTime

    return date
  }

  const convertDateToBlock = (date: number) => {
    if (!date) {
      return
    }
    const timeOfTheFirstBlock = convertBlockToDate(0)

    const differenceBetweenNowAndProvidedDate = date - timeOfTheFirstBlock

    const amountOfBlocks = Math.round(differenceBetweenNowAndProvidedDate / 6000)

    return amountOfBlocks
  }

  return { currentBlock, timeofTheLastBlock, convertBlockToDate, convertDateToBlock }
}
