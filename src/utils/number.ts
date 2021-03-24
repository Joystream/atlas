export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US').split(',').join(' ')
}

export const formatNumberShort = (num: number): string => {
  let value = num
  let suffix = ''

  if (num >= 1000000) {
    value /= 1000000
    suffix = 'M'
  } else if (num >= 1000) {
    value /= 1000
    suffix = 'K'
  }

  let formattedValue = value.toFixed(1)
  if (formattedValue.endsWith('.0')) {
    formattedValue = formattedValue.slice(0, formattedValue.length - 2)
  }

  return `${formattedValue}${suffix}`
}

const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
export const formatBytes = (x: number) => {
  let l = 0

  while (x >= 1024 && ++l) {
    x = x / 1024
  }
  // include a decimal point and a tenths-place digit if presenting
  // less than ten of KB or greater units
  return x.toFixed(x < 10 && l > 0 ? 1 : 0) + units[l]
}
