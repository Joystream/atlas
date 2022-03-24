import { useCallback, useContext } from 'react'

import { NftActionsContext } from './provider'

export const useNftActions = () => {
  const ctx = useContext(NftActionsContext)
  if (ctx === undefined) {
    throw new Error('useNftActions must be used within NftActionsProvider')
  }

  const {
    currentAction,
    currentNftId,
    setCurrentAction,
    setCurrentNftId,
    closeNftAction,
    cancelNftSale,
    changeNftPrice,
  } = ctx

  const openNftPurchase = useCallback(
    (nftId: string) => {
      setCurrentNftId(nftId)
      setCurrentAction('purchase')
    },
    [setCurrentAction, setCurrentNftId]
  )

  const openNftPutOnSale = useCallback(
    (nftId: string) => {
      setCurrentNftId(nftId)
      setCurrentAction('putOnSale')
    },
    [setCurrentAction, setCurrentNftId]
  )

  const openNftSettlement = useCallback(
    (nftId: string) => {
      setCurrentNftId(nftId)
      setCurrentAction('settle')
    },
    [setCurrentAction, setCurrentNftId]
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
