export const urlParams = (object: Record<string, string | number | boolean>) => {
  const formattedObject = Object.fromEntries(Object.entries(object).map(([_, val]) => [_, val.toString()]))
  return `?${new URLSearchParams(formattedObject).toString()}`
}
