import BN from 'bn.js'
import { useEffect, useState } from 'react'

import { useJoystream } from '@/providers/joystream'
import { useUser } from '@/providers/user'

export const useSubscribeAccountBalance = (controllerAccount?: string | null) => {
  const [accountBalance, setAccountBalance] = useState<BN | undefined>()
  const { activeMembership } = useUser()
  const { joystream, proxyCallback } = useJoystream()

  useEffect(() => {
    if (!activeMembership?.controllerAccount || !joystream) {
      return
    }

    let unsubscribe: (() => void) | undefined
    const init = async () => {
      unsubscribe = await joystream.subscribeAccountBalance(
        controllerAccount || activeMembership.controllerAccount,
        proxyCallback((balance) => setAccountBalance(new BN(balance)))
      )
    }
    init()

    return () => {
      unsubscribe?.()
    }
  }, [activeMembership, controllerAccount, joystream, proxyCallback])

  return accountBalance
}
