// we need to use different library for big number, because BN doesn't support decimals
import BigNumber from 'bignumber.js'
import BN from 'bn.js'

import { HAPI_TO_JOY_RATE } from '@/config/joystream'

export const getRandomIntInclusive = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const numberFormatter = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 21 })
export const formatNumber = (num: number): string => {
  return numberFormatter.format(num).replaceAll(',', ' ')
}

export const hapiBnToTokenNumber = (bn: BN) => {
  const bnToString = bn.toString()
  const token = new BigNumber(bnToString).dividedBy(new BigNumber(HAPI_TO_JOY_RATE))
  return token.toNumber()
}

export const tokenNumberToHapiBn = (number: number) => {
  const numberToString = number.toFixed()
  if (new BigNumber(numberToString).isNaN()) {
    return new BN(0)
  }
  const bn = new BigNumber(numberToString).multipliedBy(new BigNumber(HAPI_TO_JOY_RATE)).toFixed()
  return new BN(bn)
}
