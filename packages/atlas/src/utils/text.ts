export const removeSpecialCharacters = (input: string) => {
  const regex = /[^\w\s]|_/g
  return input.replace(regex, '').toLowerCase()
}
