type HasId = {
  id: string
}

export const createLookup = <T extends HasId>(data: T[]): Record<string, T> => {
  return data.reduce((acc, item) => {
    if (item) {
      acc[item.id] = item
    }
    return acc
  }, {} as Record<string, T>)
}

export const promisify =
  <T>(fn: (...args: unknown[]) => T) =>
  (...args: Parameters<typeof fn>) =>
    new Promise((resolve) => resolve(fn(...args))) as Promise<T>
