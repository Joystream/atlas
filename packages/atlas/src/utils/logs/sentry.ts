import * as Sentry from '@sentry/react'
import { Severity } from '@sentry/react'

import { ConsoleLogger } from './console'

type LogContexts = Record<string, Record<string, unknown>>

type LogMessageLevel = 'log' | 'warning' | 'error'

class SentryError extends Error {
  name: string
  message: string

  constructor(name: string, message: string) {
    super()
    this.name = name
    this.message = message
  }
}

class _SentryLogger {
  private initialized = false
  private user?: Record<string, unknown>

  initialize(DSN: string) {
    Sentry.init({
      dsn: DSN,
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
      ],
    })
    this.initialized = true
  }

  setUser(user?: Record<string, unknown>) {
    this.user = user
  }

  error(
    title: string,
    source: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawError?: any,
    contexts?: LogContexts
  ) {
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

    ConsoleLogger.error(!message ? title : `${title}: ${message}`, { ...error, ...contexts })

    if (!this.initialized) {
      ConsoleLogger.debug("Skipping Sentry error capture because SentryLogger wasn't initialized")
      return
    }

    Sentry.captureException(new SentryError(title, message), {
      contexts: {
        error,
        ...contexts,
      },
      tags,
      user: { ...this.user, ip_address: '{{auto}}' },
    })
  }

  message(message: string, source: string, level: LogMessageLevel, contexts?: LogContexts) {
    const logFn = level === 'error' ? ConsoleLogger.error : level === 'warning' ? ConsoleLogger.warn : ConsoleLogger.log
    logFn(message, contexts)

    if (!this.initialized) {
      ConsoleLogger.debug("Skipping Sentry message capture because SentryLogger wasn't initialized")
      return
    }

    Sentry.captureMessage(message, {
      level: Severity.fromString(level),
      contexts,
      tags: { source },
      user: { ...this.user, ip_address: '{{auto}}' },
    })
  }
}

export const SentryLogger = new _SentryLogger()
