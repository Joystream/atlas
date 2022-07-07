import BN from 'bn.js'

export const getRandomIntInclusive = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const numberFormatter = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 21 })
export const formatNumber = (num: number): string => {
  return numberFormatter.format(num).replaceAll(',', ' ')
}

export const HapiBNToTJOYNumber = (bn: BN) => bn.div(new BN(10 ** 10)).toNumber()

const bn = new BN(10 ** 10)
export const TJOYNUmberToHapiBN = (number: number) => new BN(number).mul(bn)
