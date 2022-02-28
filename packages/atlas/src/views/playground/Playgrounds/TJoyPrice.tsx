import React, { useState } from 'react'

import { useTokenPrice } from '@/providers/joystream'

export const TJoyPrice = () => {
  const { convertToUSD, convertToTJoy } = useTokenPrice()
  const [toConvert, setToConvert] = useState(0)
  const [unit, setUnit] = useState('tJoy')
  const [converted, setConverted] = useState<number | string>(0)
  const [showConverted, setShowConverted] = useState(false)
  const convert = () => {
    setShowConverted(true)
    unit === 'tJoy' ? setConverted(convertToUSD(toConvert)) : setConverted(convertToTJoy(toConvert))
  }
  const convertedUnit = unit === 'usd' ? 'tJoy' : 'usd'
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
          <option value="tJoy">tJoy</option>
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
