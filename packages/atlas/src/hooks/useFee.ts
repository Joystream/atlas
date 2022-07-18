import debouncePromise from 'awesome-debounce-promise'
import { isEqual } from 'lodash-es'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { TxMethodName } from '@/joystream-lib'
import { JoystreamLibExtrinsics } from '@/joystream-lib/extrinsics'
import { useJoystream } from '@/providers/joystream'
import { useUser } from '@/providers/user'

import { useSubscribeAccountBalance } from './useSubscribeAccountBalance'

export const useFee = <TFnName extends TxMethodName, TArgs extends Parameters<JoystreamLibExtrinsics[TFnName]>>(
  methodName: TFnName,
  args?: TArgs
) => {
  const { joystream } = useJoystream()
  const accountBalance = useSubscribeAccountBalance()
  const [fee, setfee] = useState(0)
  const [loading, setLoading] = useState(false)
  const argsRef = useRef(args)
  const { accountId } = useUser()

  const calculateFee = useCallback(
    async (args?: TArgs) => {
      if (!args || !accountId) {
        return
      }

      const fee = await (await joystream?.extrinsics)?.getFee(accountId, methodName, args)
      return fee
    },
    [accountId, joystream, methodName]
  )

  const getFee = useMemo(
    () =>
      debouncePromise(async (args?: TArgs) => {
        if (!args || !accountId) {
          return
        }

        const fee = await (await joystream?.extrinsics)?.getFee(accountId, methodName, args)

        if (fee) {
          setfee(fee)
        }
        setLoading(false)
      }, 500),
    [accountId, joystream, methodName]
  )

  useEffect(() => {
    if (!args || isEqual(args, argsRef.current)) {
      return
    }
    argsRef.current = args
    setLoading(true)
    getFee(args)
  }, [args, getFee])

  return { fee, hasEnoughFunds: fee > (accountBalance || 0), loading, calculateFee }
}
