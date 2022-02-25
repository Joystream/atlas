import { useContext } from 'react'

import { PlaceBidContext } from './provider'

export const usePlaceBid = () => {
  const ctx = useContext(PlaceBidContext)
  if (ctx === undefined) {
    throw new Error('usePlaceBidWorkspace must be used within a PlaceBidProvider')
  }
  return ctx
}
