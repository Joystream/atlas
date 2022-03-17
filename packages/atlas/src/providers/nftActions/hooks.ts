import { useCallback, useContext } from 'react'

import { useDisplaySignInDialog } from '@/hooks/useDisplaySignInDialog'

import { NftActionsContext } from './provider'

import { useUser } from '../user'

type OpenNftPurchaseOpts = {
  fixedPrice?: boolean
}

export const useNftActions = () => {
  const ctx = useContext(NftActionsContext)
  if (ctx === undefined) {
    throw new Error('useNftActions must be used within NftActionsProvider')
  }
  const { activeMemberId, activeAccountId, signIn } = useUser()
  const isSignedIn = activeMemberId && activeAccountId
  const { openSignInDialog } = useDisplaySignInDialog()

  const {
    currentAction,
    currentNftId,
    setCurrentAction,
    setCurrentNftId,
    closeNftAction,
    cancelNftSale,
    changeNftPrice,
    boughtForFixedPrice,
    setBoughtForFixedPrice,
  } = ctx

  const checkIfSigned = useCallback(() => {
    if (!isSignedIn) {
      openSignInDialog({ onConfirm: signIn })
    }
    return isSignedIn
  }, [isSignedIn, openSignInDialog, signIn])

  const openNftPurchase = useCallback(
    (nftId: string, opts?: OpenNftPurchaseOpts) => {
      if (!checkIfSigned()) {
        return
      }
      setCurrentNftId(nftId)
      setCurrentAction('purchase')
      setBoughtForFixedPrice(opts?.fixedPrice)
    },
    [checkIfSigned, setBoughtForFixedPrice, setCurrentAction, setCurrentNftId]
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
    boughtForFixedPrice,
    currentNftId,
    openNftPurchase,
    openNftPutOnSale,
    openNftSettlement,
    closeNftAction,
    openNftAcceptBid,
    openNftChangePrice,
    cancelNftSale,
    changeNftPrice,
  }
}
