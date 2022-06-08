import React, { useEffect, useRef } from 'react'

import { useJoystream } from '@/providers/joystream'

import { useCurrentBlockStore } from './currentBlock.store'

export const CurrentBlockManager: React.FC = () => {
  const { setCurrentBlock, setCurrentBlockMsTimestamp } = useCurrentBlockStore((state) => state.actions)
  const { joystream, proxyCallback } = useJoystream()
  const firstRender = useRef(true)

  // fetch current block from the chain, but only just once
  useEffect(() => {
    if (!firstRender.current || !joystream) {
      return
    }
    joystream.getCurrentBlock().then((block) => {
      setCurrentBlock(block)
      firstRender.current = false
    })
  }, [joystream, setCurrentBlock])

  // subscribe to block updates
  useEffect(() => {
    if (!joystream) {
      return
    }

    let unsubscribe
    const init = async () => {
      unsubscribe = await joystream.subscribeCurrentBlock(
        proxyCallback((number) => {
          setCurrentBlock(number)
          setCurrentBlockMsTimestamp(Date.now())
        })
      )
    }
    init()

    return unsubscribe
  }, [joystream, proxyCallback, setCurrentBlock, setCurrentBlockMsTimestamp])

  return null
}
