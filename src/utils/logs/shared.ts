export const getLogArgs = (message: string, details?: unknown) => {
  if (details) {
    return [message, details]
  }
  return [message]
}
