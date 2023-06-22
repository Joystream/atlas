import { formatNumber } from '@/utils/number'

export class TimeoutError<T> extends Error {
  payload: T

  constructor(payload: T) {
    super()
    this.payload = payload
  }
}

export const withTimeout = async <T, P>(promise: Promise<T> | Promise<T>[], timeout: number, rejectionPayload?: P) => {
  const timeoutPromise = new Promise<T>((resolve, reject) =>
    setTimeout(() => reject(new TimeoutError(rejectionPayload)), timeout)
  )
  return await Promise.race([timeoutPromise, ...[promise].flat()])
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

export const retryPromise = <T>(
  promiseFactory: () => Promise<T | null>,
  interval: number,
  timeout: number
): Promise<T | null> => {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timeoutCleanup)
      clearInterval(intervalCleanup)
    }
    const intervalCleanup = setInterval(async () => {
      const result = await promiseFactory()
      if (result) {
        cleanup()
        return resolve(result)
      }
    }, interval)
    const timeoutCleanup = setTimeout(() => {
      cleanup()
      return reject(new TimeoutError('Timed out in retrying the promise'))
    }, timeout)
  })
}
