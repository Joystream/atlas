import { useCallback, useContext } from 'react'

import { JoystreamContext } from './provider'

export const useJoystream = () => {
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

  const { getTokenPrice } = ctx

  const convertToUSD = useCallback(
    (tokens: number) => {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      })

      const price = getTokenPrice()
      return formatter.format(tokens * price)
    },
    [getTokenPrice]
  )
  const convertToTJoy = useCallback(
    (dollars: number) => {
      const price = getTokenPrice()
      if (!price) return 0
      return dollars / price
    },
    [getTokenPrice]
  )

  return {
    convertToUSD,
    convertToTJoy,
  }
}
