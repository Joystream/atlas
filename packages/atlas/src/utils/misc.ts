import { formatNumber } from '@/utils/number'

export class TimeoutError extends Error {}

export const withTimeout = async <T>(promise: Promise<T>, timeout: number) => {
  const timeoutPromise = new Promise<T>((resolve, reject) => setTimeout(() => reject(new TimeoutError()), timeout))
  return await Promise.race([timeoutPromise, promise])
}

export const pluralizeNoun = (count: number, noun: string, formatCount?: boolean, suffix = 's') =>
  `${formatCount ? formatNumber(count) : count} ${noun}${count > 1 ? suffix : ''}`

export const wait = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), milliseconds)
  })

export const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)

export const shortenString = (text: string, firstLettersAmount: number, lastLettersAmount = firstLettersAmount) => {
  const arrayFromString = text.split('')
  const firstLetters = arrayFromString.slice(0, firstLettersAmount).join('')
  const lastLetters = arrayFromString.slice(arrayFromString.length - 1 - lastLettersAmount).join('')
  return `${firstLetters}...${lastLetters}`
}
