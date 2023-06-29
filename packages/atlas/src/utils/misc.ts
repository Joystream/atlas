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

// this helper will not care for errors other than timeout error, it's used
// for scenarions when wallet is not available on first call
export const retryWalletPromise = <T>(
  promiseFactory: () => Promise<T | null>,
  interval: number,
  timeout: number
): Promise<T | null> => {
  if (interval > timeout || timeout % interval !== 0) {
    throw new Error('Adjust timeout and interval')
  }
  return new Promise((resolve, reject) => {
    const intervalPromise = new Promise<T | null>((res) => {
      const numberOfTries = timeout / interval

      const init = async () => {
        for (let i = 0; i < numberOfTries; i++) {
          try {
            const result = await Promise.race([
              promiseFactory(),
              new Promise<T>((_, innerReject) =>
                setTimeout(() => {
                  innerReject(new TimeoutError('Timeout in interval'))
                }, interval)
              ),
            ])
            res(result)
            break
          } catch {
            // Failed, but continue to try
          }
        }
      }

      init()
    })

    const mainTimeoutPromise = new Promise<T | null>((_, innerReject) => {
      setTimeout(() => {
        innerReject(new TimeoutError('Timed out in retrying the promise'))
      }, timeout)
    })

    Promise.race([intervalPromise, mainTimeoutPromise])
      .then((result) => resolve(result))
      .catch((error) => reject(error))
  })
}
