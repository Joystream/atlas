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

const conversionBn = new BN(HAPI_TO_JOY_RATE)

export const hapiBnToTokenNumber = (bn: BN) => {
  const div = bn.div(conversionBn).toNumber()
  const mod = bn.mod(conversionBn).toNumber()
  return div + mod / HAPI_TO_JOY_RATE
}

export const tokenNumberToHapiBn = (number: number) => {
  if (Number.isInteger(number)) {
    return new BN(number).mul(conversionBn)
  } else {
    // we need to use different library in this case since BN doesn't support decimals
    const multiplied = new BigNumber(number).multipliedBy(HAPI_TO_JOY_RATE).toString()
    return new BN(multiplied)
  }
}
