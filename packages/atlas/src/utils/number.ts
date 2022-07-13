import BN from 'bn.js'

export const getRandomIntInclusive = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const numberFormatter = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 21 })
export const formatNumber = (num: number): string => {
  return numberFormatter.format(num).replaceAll(',', ' ')
}

const conversionBN = new BN(10 ** 10)
export const HapiBNToTokenNumber = (bn: BN) => {
  const integer = bn.div(conversionBN).toNumber()
  if (integer) {
    return integer
  } else {
    return bn.toNumber() / conversionBN.toNumber()
  }
}
export const TokenNumberToHapiBN = (number: number) => {
  return new BN(number * 10 ** 10)
}
