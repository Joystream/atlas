export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US').split(',').join(' ')
}

export const formatNumberShort = (num: number): string => {
  let value = num
  let suffix = ''
  if (num >= 1000000000000) {
    value /= 1000000000000
    suffix = 'T'
  } else if (num >= 1000000000) {
    value /= 1000000000
    suffix = 'B'
  } else if (num >= 1000000) {
    value /= 1000000
    suffix = 'M'
  } else if (num >= 1000) {
    value /= 1000
    suffix = 'K'
  }

  const formattedValue = value.toLocaleString('no', { maximumFractionDigits: 1 })

  return `${formattedValue}${suffix}`
}

export const getRandomIntInclusive = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
