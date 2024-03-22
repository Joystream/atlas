// we need to use different library for big number, because BN doesn't support decimals
import { PERMILL_PER_PERCENT } from '@/joystream-lib/config'

export const getRandomIntInclusive = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
const smallDecimalFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 10 })

export const formatNumber = (num: number): string => {
  return numberFormatter.format(num).replaceAll(',', ' ')
}

export const formatSmallDecimal = (num: number): string => smallDecimalFormatter.format(num).replaceAll(',', ' ')

export const permillToPercentage = (permill: number) => permill / PERMILL_PER_PERCENT
