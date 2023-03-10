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

export const repeat = <T = undefined>(count: number, data?: T) => Array.from({ length: count }, () => data)

type PlaceholderData<T> = T extends undefined ? { id: undefined } : T

export const createPlaceholderData = <T = { id: undefined }>(
  count: number,
  additionalData?: T
): PlaceholderData<T>[] => {
  if (typeof additionalData !== 'undefined') {
    return repeat(count, additionalData) as PlaceholderData<T>[]
  }
  return repeat(count, { id: undefined }) as PlaceholderData<T>[]
}
