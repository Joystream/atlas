import { useEffect, useState } from 'react'

import { useJoystream } from '@/providers/joystream'
import { useUser } from '@/providers/user'

export const useSubsribeAccountBalance = () => {
  const [accountBalance, setAccountBalance] = useState<number | undefined>()
  const { activeMembership } = useUser()
  const { joystream, proxyCallback } = useJoystream()

  useEffect(() => {
    if (!activeMembership || !joystream) {
      return
    }

    let unsubscribe
    const init = async () => {
      unsubscribe = await joystream.subscribeAccountBalance(
        activeMembership.controllerAccount,
        proxyCallback(setAccountBalance)
      )
    }
    init()

    return unsubscribe
  }, [activeMembership, joystream, proxyCallback])

  return accountBalance
}
