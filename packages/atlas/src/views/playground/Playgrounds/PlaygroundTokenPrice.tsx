import React, { useState } from 'react'

import { JOY_CURRENCY_TICKER } from '@/config/token'
import { useTokenPrice } from '@/providers/joystream'

export const PlaygroundTokenPrice = () => {
  const { convertToUSD, convertToTokenPrice } = useTokenPrice()
  const [toConvert, setToConvert] = useState(0)
  const [unit, setUnit] = useState(JOY_CURRENCY_TICKER)
  const [converted, setConverted] = useState<number | string | null>(0)
  const [showConverted, setShowConverted] = useState(false)
  const convert = () => {
    setShowConverted(true)
    unit === JOY_CURRENCY_TICKER ? setConverted(convertToUSD(toConvert)) : setConverted(convertToTokenPrice(toConvert))
  }
  const convertedUnit = unit === 'usd' ? JOY_CURRENCY_TICKER : 'usd'
  return (
    <div>
      <div>
        Converter:
        <input
          type="number"
          value={toConvert}
          onChange={(v) => {
            setShowConverted(false)
            setToConvert(parseInt(v.target.value))
          }}
        />
        <select
          onChange={(v) => {
            setShowConverted(false)
            setUnit(v.target.value)
          }}
          value={unit}
        >
          <option value="usd">USD</option>
          <option value={JOY_CURRENCY_TICKER}>{JOY_CURRENCY_TICKER}</option>
        </select>
      </div>
      <div>
        {' '}
        <button onClick={convert}>Convert</button>
      </div>
      {showConverted ? (
        <div>
          {toConvert} {unit} = {converted} {convertedUnit}
        </div>
      ) : null}
    </div>
  )
}
