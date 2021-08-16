/* eslint-disable no-console */
import * as Sentry from '@sentry/react'
import { Severity } from '@sentry/react'

class CustomError extends Error {
  name: string
  message: string

  constructor(name: string, message: string) {
    super()
    this.name = name
    this.message = message
  }
}

type LogContexts = Record<string, Record<string, unknown>>
type LogFn = (message: string, details?: unknown) => void
type LogMessageLevel = 'info' | 'warning' | 'error'

const getLogArgs = (message: string, details?: unknown) => {
  if (details) {
    return [message, details]
  }
  return [message]
}

export class Logger {
  static log: LogFn = (message, details) => {
    console.log(...getLogArgs(message, details))
  }

  static warn: LogFn = (message, details) => {
    console.warn(...getLogArgs(message, details))
  }

  static error: LogFn = (message, details) => {
    console.error(...getLogArgs(message, details))
  }

  static debug: LogFn = (message, details) => {
    console.debug(...getLogArgs(message, details))
  }

  static captureError = (
    title: string,
    source: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawError?: any,
    contexts?: LogContexts
  ) => {
    let error = rawError
    const tags: Record<string, string | number> = {
      source,
    }

    let rawGraphQLError = error?.graphQLErrors?.[0]?.originalError
    if (rawGraphQLError?.graphQLErrors?.[0]?.originalError) {
      rawGraphQLError = rawGraphQLError.graphQLErrors[0].originalError
    }
    if (rawGraphQLError) {
      error = {
        ...error,
        graphQLError: rawGraphQLError.result?.errors[0],
        url: rawGraphQLError.response?.url,
      }
    }

    const statusCode = error?.statusCode || error?.response?.status || rawGraphQLError?.statusCode
    if (statusCode) {
      tags.statusCode = statusCode
    }

    const message = rawError?.message || rawGraphQLError?.message || ''

    Logger.error(!message ? title : `${title}: ${message}`, { ...error, ...contexts })

    Sentry.captureException(new CustomError(title, message), {
      contexts: {
        error,
        ...contexts,
      },
      tags,
    })
  }

  static captureMessage = (message: string, source: string, level: LogMessageLevel, contexts?: LogContexts) => {
    Sentry.captureMessage(message, { level: Severity.fromString(level), contexts, tags: { source } })
  }
}
