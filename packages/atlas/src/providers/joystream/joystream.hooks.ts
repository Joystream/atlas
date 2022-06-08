import { useCallback, useContext } from 'react'

import { JoystreamContext, JoystreamContextValue } from '.'

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
    (tokens: number) => {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumSignificantDigits: 3,
      })
      return tokenPrice ? formatter.format(tokens * tokenPrice) : null
    },
    [tokenPrice]
  )
  const convertToTJoy = useCallback(
    (dollars: number) => {
      if (!tokenPrice) return 0
      return dollars / tokenPrice
    },
    [tokenPrice]
  )
  const isLoadingPrice = tokenPrice === 0

  return {
    convertToUSD,
    convertToTJoy,
    isLoadingPrice,
  }
}
