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

  let formattedValue = value.toFixed(1)

  if (Number(formattedValue) >= 1000) {
    const tempNumber: string[] = []
    const formattedValueAsArray = [...formattedValue]
    formattedValueAsArray.forEach((value, idx) => {
      tempNumber.push(value)
      if (idx === 0 || (formattedValue.length - idx > 5 && idx % 3 === 0)) {
        tempNumber.push(' ')
      }
    })
    formattedValue = tempNumber.join('')
  }

  if (formattedValue.endsWith('.0')) {
    formattedValue = formattedValue.slice(0, formattedValue.length - 2)
  }

  return `${formattedValue.replace('.', ',')}${suffix}`
}

export const getRandomIntInclusive = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
