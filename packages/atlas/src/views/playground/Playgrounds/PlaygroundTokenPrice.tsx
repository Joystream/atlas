import BN from 'bn.js'
import { useState } from 'react'

import { atlasConfig } from '@/config'
import { useTokenPrice } from '@/providers/joystream'

export const PlaygroundTokenPrice = () => {
  const { convertHapiToUSD, convertUSDToHapi } = useTokenPrice()
  const [toConvert, setToConvert] = useState(new BN(0))
  const [converted, setConverted] = useState<number>(0)
  const [unit, setUnit] = useState(atlasConfig.joystream.tokenTicker)
  const [showConverted, setShowConverted] = useState(false)
  const convert = () => {
    setShowConverted(true)
    unit === atlasConfig.joystream.tokenTicker
      ? setConverted(convertHapiToUSD(toConvert) ?? 0)
      : setToConvert(convertUSDToHapi(converted))
  }
  const convertedUnit = unit === 'usd' ? atlasConfig.joystream.tokenTicker : 'usd'
  return (
    <div>
      <div>
        Converter:
        <input
          type="number"
          value={toConvert.toString()}
          onChange={(v) => {
            setShowConverted(false)
            setToConvert(new BN(v.target.value))
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
          <option value={atlasConfig.joystream.tokenTicker}>{atlasConfig.joystream.tokenTicker}</option>
        </select>
      </div>
      <div>
        {' '}
        <button onClick={convert}>Convert</button>
      </div>
      {showConverted ? (
        <div>
          {toConvert.toString()} {unit} = {converted} {convertedUnit}
        </div>
      ) : null}
    </div>
  )
}
