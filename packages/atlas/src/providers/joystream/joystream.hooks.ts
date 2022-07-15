import BN from 'bn.js'
import { useCallback, useContext } from 'react'

import { hapiBnToTokenNumber, tokenNumberToHapiBn } from '@/utils/number'

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
      return tokenPrice ? hapiBnToTokenNumber(tokens) * tokenPrice : null
    },
    [tokenPrice]
  )
  const convertToTokenPrice = useCallback(
    (dollars: number) => {
      if (!tokenPrice) return new BN(0)
      return tokenNumberToHapiBn(dollars / tokenPrice)
    },
    [tokenPrice]
  )
  const isLoadingPrice = tokenPrice === 0

  return {
    convertToUSD,
    convertToTokenPrice,
    isLoadingPrice,
  }
}
