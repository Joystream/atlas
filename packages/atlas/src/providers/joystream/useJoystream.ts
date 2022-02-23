import { useContext } from 'react'

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

  const { price } = ctx
  const convertToUSD = (tJoy: number) => tJoy * price
  const convertToTJoy = (USD: number) => USD / price
  return {
    price,
    convertToUSD,
    convertToTJoy,
  }
}
