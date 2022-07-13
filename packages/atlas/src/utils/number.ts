import BN from 'bn.js'

export const getRandomIntInclusive = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const numberFormatter = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 21 })
export const formatNumber = (num: number): string => {
  return numberFormatter.format(num).replaceAll(',', ' ')
}

const TEN_BILLIONS = 10 ** 10

const conversionBN = new BN(TEN_BILLIONS)

export const HapiBNToTokenNumber = (bn: BN) => {
  const div = bn.div(conversionBN).toNumber()
  const mod = bn.mod(conversionBN).toNumber()
  return div + mod / TEN_BILLIONS
}

export const TokenNumberToHapiBN = (number: number) => {
  if (Number.isInteger(number)) {
    return new BN(number).mul(conversionBN)
  } else {
    return new BN(number * TEN_BILLIONS)
  }
}
