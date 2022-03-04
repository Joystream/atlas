import { useContext } from 'react'

import { AuctionContext } from './provider'

export const useAuction = () => {
  const ctx = useContext(AuctionContext)
  if (ctx === undefined) {
    throw new Error('usePlaceBidWorkspace must be used within a AuctionProvider')
  }
  return ctx
}
