import { useCallback, useContext } from 'react'

import { JoystreamContext, JoystreamContextValue } from './provider'

export const useJoystream = (): JoystreamContextValue => {
  const ctx = useContext(JoystreamContext)
  if (!ctx) {
    throw new Error('useJoystream must be used within JoystreamProvider')
  }
  return ctx
}

export const useTokenPrice = () => {
  const ctx = useContext(JoystreamContext)
  if (!ctx) {
    throw new Error('useJoystream must be used within JoystreamProvider')
  }

  const { tokenPrice } = ctx

  const convertToUSD = useCallback(
    (tokens: number) => {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumSignificantDigits: 3,
      })
      return formatter.format(tokens * tokenPrice)
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

  return {
    convertToUSD,
    convertToTJoy,
  }
}
