import BN from 'bn.js'
import { useCallback, useEffect, useState } from 'react'

import { useSubscribeAccountBalance } from '@/providers/joystream/joystream.hooks'
import { useSnackbar } from '@/providers/snackbars'

export const useHasEnoughBalance = (feeLoading: boolean, fee?: BN, callback?: () => void) => {
  const [loadingState, setLoadingState] = useState(false)
  const { totalBalanceLoaded, totalBalance } = useSubscribeAccountBalance()
  const { displaySnackbar } = useSnackbar()

  const callbackHandler = useCallback(() => {
    if (!fee) {
      return
    }
    if (totalBalance?.lt(fee)) {
      displaySnackbar({
        title: 'Not enough funds',
        description:
          "You don't have enough funds to cover blockchain transaction fee for this operation. Please, top up your account balance and try again.",
        iconType: 'error',
      })
      return
    }
    callback?.()
  }, [callback, displaySnackbar, fee, totalBalance])

  useEffect(() => {
    if (loadingState && !feeLoading && totalBalanceLoaded) {
      callbackHandler?.()
      setLoadingState(false)
    }
  }, [callback, loadingState, feeLoading, totalBalanceLoaded, totalBalance, displaySnackbar, callbackHandler])

  const signTransactionHandler = useCallback(() => {
    if (feeLoading || !totalBalanceLoaded) {
      setLoadingState(true)
      return
    }
    callbackHandler()
  }, [totalBalanceLoaded, callbackHandler, feeLoading])

  return {
    loadingState,
    signTransactionHandler,
  }
}
