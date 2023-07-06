import { useCallback, useContext } from 'react'

import { useDisplaySignInDialog } from '@/hooks/useDisplaySignInDialog'
import { useUser } from '@/providers/user/user.hooks'

import { NftActionsContext } from './nftActions.provider'

type OpenNftPurchaseOpts = {
  fixedPrice?: boolean
}

export const useNftActions = () => {
  const ctx = useContext(NftActionsContext)
  if (ctx === undefined) {
    throw new Error('useNftActions must be used within NftActionsProvider')
  }
  const { signIn, isLoggedIn } = useUser()
  const { openSignInDialog } = useDisplaySignInDialog({ interaction: true })

  const {
    currentAction,
    currentNftId,
    setCurrentAction,
    setCurrentNftId,
    isBuyNowClicked,
    setIsBuyNowClicked,
    closeNftAction,
    cancelNftSale,
    changeNftPrice,
    nftToMint,
    setNftToMint,
  } = ctx

  const checkIfSigned = useCallback(() => {
    if (!isLoggedIn) {
      openSignInDialog({ onConfirm: signIn })
    }
    return isLoggedIn
  }, [isLoggedIn, openSignInDialog, signIn])

  const openNftPurchase = useCallback(
    (nftId: string, opts?: OpenNftPurchaseOpts) => {
      if (!checkIfSigned()) {
        return
      }
      setCurrentNftId(nftId)
      setCurrentAction('purchase')
      setIsBuyNowClicked(opts?.fixedPrice)
    },
    [checkIfSigned, setCurrentNftId, setCurrentAction, setIsBuyNowClicked]
  )

  const openNftPutOnSale = useCallback(
    (nftId: string) => {
      if (!checkIfSigned()) {
        return
      }
      setCurrentNftId(nftId)
      setCurrentAction('putOnSale')
    },
    [checkIfSigned, setCurrentAction, setCurrentNftId]
  )

  const openNftSettlement = useCallback(
    (nftId: string) => {
      if (!checkIfSigned()) {
        return
      }
      setCurrentNftId(nftId)
      setCurrentAction('settle')
    },
    [checkIfSigned, setCurrentAction, setCurrentNftId]
  )

  const openNftAcceptBid = useCallback(
    (nftId: string) => {
      setCurrentNftId(nftId)
      setCurrentAction('accept-bid')
    },
    [setCurrentAction, setCurrentNftId]
  )

  const openNftChangePrice = useCallback(
    (nftId: string) => {
      setCurrentNftId(nftId)
      setCurrentAction('change-price')
    },
    [setCurrentAction, setCurrentNftId]
  )

  return {
    currentAction,
    isBuyNowClicked,
    currentNftId,
    openNftPurchase,
    openNftPutOnSale,
    openNftSettlement,
    closeNftAction,
    openNftAcceptBid,
    openNftChangePrice,
    cancelNftSale,
    changeNftPrice,
    nftToMint,
    setNftToMint,
  }
}
