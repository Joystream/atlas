/* eslint-disable no-console */
export const Logger = {
  log: (message: string, details?: unknown) => {
    console.log(message, details)
  },

  warn: (message: string, details?: unknown) => {
    console.warn(message, details)
  },

  error: (message: string, details?: unknown) => {
    console.error(message, details)
  },

  debug: (message: string, details?: unknown) => {
    console.debug(message, details)
  },
}
