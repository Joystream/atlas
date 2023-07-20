import { FC, useEffect, useRef } from 'react'

import { useJoystream } from './joystream.provider'
import { useJoystreamStore } from './joystream.store'

export const JoystreamManager: FC = () => {
  const { setCurrentBlock, setCurrentBlockMsTimestamp } = useJoystreamStore((state) => state.actions)
  const { joystream, proxyCallback } = useJoystream()
  const firstRender = useRef(true)

  // fetch current block from the chain, but only just once
  useEffect(() => {
    if (!firstRender.current || !joystream) {
      return
    }
    joystream.getCurrentBlock().then((block) => {
      setCurrentBlock(block)
      setCurrentBlockMsTimestamp(Date.now())
      firstRender.current = false
    })
  }, [joystream, setCurrentBlock, setCurrentBlockMsTimestamp])

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
