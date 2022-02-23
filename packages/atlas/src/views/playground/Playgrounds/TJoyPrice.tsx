import React from 'react'

import { useTokenPrice } from '@/providers/joystream'

export const TJoyPrice = () => {
  const { price, formattedPrice } = useTokenPrice()
  return (
    <div>
      <div>tJoy price: {price}</div>
      <div>Formatted tJoy price: {formattedPrice}</div>
    </div>
  )
}
