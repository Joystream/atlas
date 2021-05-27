export const readFromLocalStorage = <T>(key: string, { deserialize = JSON.parse } = {}) => {
  const valueInLocalStorage = window.localStorage.getItem(key)
  if (valueInLocalStorage) {
    try {
      return deserialize(valueInLocalStorage) as T
    } catch (error) {
      console.error(
        `An error occured when deserializing a value from Local Storage. Did you pass the correct serializer to readFromLocalStorage?`
      )
      throw error
    }
  }
}

export const writeToLocalStorage = <T>(key: string, value: T, { serialize = JSON.stringify } = {}) => {
  window.localStorage.setItem(key, serialize(value))
}
