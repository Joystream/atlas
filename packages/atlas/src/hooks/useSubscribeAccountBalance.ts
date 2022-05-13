import { useEffect, useState } from 'react'

import { useJoystream } from '@/providers/joystream'
import { useUser } from '@/providers/user'

export const useSubscribeAccountBalance = () => {
  const [accountBalance, setAccountBalance] = useState<number | undefined>()
  const { activeMembership } = useUser()
  const { joystream, proxyCallback } = useJoystream()

  useEffect(() => {
    if (!activeMembership?.controllerAccount || !joystream) {
      return
    }

    let unsubscribe: (() => void) | undefined
    const init = async () => {
      unsubscribe = await joystream.subscribeAccountBalance(
        activeMembership.controllerAccount,
        proxyCallback(setAccountBalance)
      )
    }
    init()

    return () => {
      unsubscribe?.()
    }
  }, [activeMembership?.controllerAccount, joystream, proxyCallback])

  return accountBalance
}
