import { useContext } from 'react'

import { NftPurchaseContext } from './provider'

export const useNftPurchase = () => {
  const ctx = useContext(NftPurchaseContext)
  if (ctx === undefined) {
    throw new Error('useNftPurchase must be used within a NftPurchaseProvider')
  }
  return ctx
}
