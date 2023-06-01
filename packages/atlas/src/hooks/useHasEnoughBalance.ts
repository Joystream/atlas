import BN from 'bn.js'
import { useCallback, useEffect, useState } from 'react'

import { useSubscribeAccountBalance } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'

export const useHasEnoughBalance = (feeLoading: boolean, fee?: BN, callback?: () => void, skipFeeCheck?: boolean) => {
  const [loadingState, setLoadingState] = useState(false)
  const { totalBalanceLoaded, totalBalance } = useSubscribeAccountBalance()
  const { displaySnackbar } = useSnackbar()

  const callbackHandler = useCallback(() => {
    if (!fee) {
      return
    }
    if (totalBalance?.lt(fee) && !skipFeeCheck) {
      displaySnackbar({
        title: 'Not enough funds',
        description:
          "You don't have enough funds to cover blockchain transaction fee for this operation. Please, top up your account balance and try again.",
        iconType: 'error',
      })
      return
    }
    callback?.()
  }, [callback, displaySnackbar, fee, skipFeeCheck, totalBalance])

  useEffect(() => {
    if (loadingState && !feeLoading && totalBalanceLoaded) {
      callbackHandler?.()
      setLoadingState(false)
    }
  }, [callbackHandler, feeLoading, loadingState, totalBalanceLoaded])

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
