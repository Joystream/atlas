export const getRandomIntInclusive = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const numberFormatter = new Intl.NumberFormat('en-US', { maximumSignificantDigits: 21 })
export const formatNumber = (num: number): string => {
  return numberFormatter.format(num).replaceAll(',', ' ')
}
