type HasId = {
  id: string
}

export const createLookup = <T extends HasId>(data: T[]): Record<string, T> => {
  return data.reduce((acc, item) => {
    acc[item.id] = item
    return acc
  }, {} as Record<string, T>)
}
