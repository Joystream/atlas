import { SentryLogger } from '@/utils/logs'

export const readFromLocalStorage = <T>(key: string, { deserialize = JSON.parse } = {}) => {
  const valueInLocalStorage = window.localStorage.getItem(key)
  if (valueInLocalStorage) {
    try {
      return deserialize(valueInLocalStorage) as T
    } catch (error) {
      SentryLogger.error('Failed to deserialize value from localStorage', 'readFromLocalStorage', error, {
        localStorage: { key, value: valueInLocalStorage },
      })
      throw error
    }
  }
}

export const writeToLocalStorage = <T>(key: string, value: T, { serialize = JSON.stringify } = {}) => {
  window.localStorage.setItem(key, serialize(value))
}
