type HasId<KeyType = string> = {
  id: KeyType
}

export const createLookup = <KeyType extends number | string, T extends HasId<KeyType>>(
  data: T[]
): Record<KeyType, T> => {
  return data.reduce((acc, item) => {
    if (item) {
      acc[item.id] = item
    }
    return acc
  }, {} as Record<KeyType, T>)
}

export const promisify =
  <T>(fn: (...args: unknown[]) => T) =>
  (...args: Parameters<typeof fn>) =>
    new Promise((resolve) => resolve(fn(...args))) as Promise<T>

export const arrayFrom = <T = undefined>(length: number, data?: T) => Array.from({ length: length }, () => data)

type PlaceholderData<T> = T extends undefined ? { id: undefined } : T

export const createPlaceholderData = <T = { id: undefined }>(
  length: number,
  additionalData?: T
): PlaceholderData<T>[] => {
  if (typeof additionalData !== 'undefined') {
    return arrayFrom(length, additionalData) as PlaceholderData<T>[]
  }
  return arrayFrom(length, { id: undefined }) as PlaceholderData<T>[]
}
