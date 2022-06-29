import BN from 'bn.js'
import { useCallback, useContext } from 'react'

import { JoystreamContext, JoystreamContextValue } from './joystream.provider'

export const useJoystream = (): JoystreamContextValue => {
  const ctx = useContext(JoystreamContext)
  if (!ctx) {
    throw new Error('useJoystream must be used within JoystreamProvider')
  }
  return ctx
}

export const useTokenPrice = () => {
  const { tokenPrice } = useJoystream()

  const convertToUSD = useCallback(
    (tokens: BN) => {
      return tokenPrice ? tokens.mul(tokenPrice).toNumber() : 0
    },
    [tokenPrice]
  )
  const convertToTokenPrice = useCallback(
    (dollars: number) => {
      if (!tokenPrice) return new BN(0)
      return new BN(dollars).div(tokenPrice)
    },
    [tokenPrice]
  )
  const isLoadingPrice = tokenPrice.isZero()

  return {
    convertToUSD,
    convertToTokenPrice,
    isLoadingPrice,
  }
}
