export class TimeoutError extends Error {}

export const withTimeout = async <T>(promise: Promise<T>, timeout: number) => {
  const timeoutPromise = new Promise<T>((resolve, reject) => setTimeout(() => reject(new TimeoutError()), timeout))
  return await Promise.race([timeoutPromise, promise])
}

export const pluralizeNoun = (count: number, noun: string, suffix = 's') => `${count} ${noun}${count > 1 ? suffix : ''}`

export const wait = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), milliseconds)
  })

export const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)
