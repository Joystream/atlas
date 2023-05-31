import * as Sentry from '@sentry/react'
import { Replay, Severity, SeverityLevel } from '@sentry/react'

import { ConsoleLogger } from './console'

type LogContexts = Record<string, Record<string, unknown>>

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
  private user?: Record<string, unknown>
  public initialized = false
  public replay?: Replay

  initialize(dsn: string | undefined | null) {
    if (!dsn) return

    Sentry.init({
      dsn,
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'ResizeObserver loop completed with undelivered notifications',
      ],
      // This sets the sample rate to be 0%, so we'll only use manually recorded replays
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
    })
    this.replay = new Sentry.Replay({ sessionSampleRate: 0, errorSampleRate: 0 })
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

    ConsoleLogger.error(!message ? title : `${title}: ${message}`, {
      ...(typeof error === 'string' ? { error } : { ...error }),
      ...contexts,
    })

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

  message(message: string, source: string, level: SeverityLevel, contexts?: LogContexts) {
    const logFn = level === 'error' ? ConsoleLogger.error : level === 'warning' ? ConsoleLogger.warn : ConsoleLogger.log
    logFn(message, contexts)

    if (!this.initialized) {
      ConsoleLogger.debug("Skipping Sentry message capture because SentryLogger wasn't initialized")
      return
    }

    Sentry.captureMessage(message, {
      level: level as Severity,
      contexts,
      tags: { source },
      user: { ...this.user, ip_address: '{{auto}}' },
    })
  }
}

export const SentryLogger = new _SentryLogger()
