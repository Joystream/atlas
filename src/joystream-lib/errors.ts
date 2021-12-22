export type JoystreamLibErrorType =
  | 'ApiNotConnectedError'
  | 'UnknownError'
  | 'FailedError'
  | 'SignCancelledError'
  | 'AccountNotSelectedError'

type JoystreamLibErrorArgs = {
  name: JoystreamLibErrorType
  message?: string
  details?: unknown
  voucherSizeLimitExceeded?: boolean
}

export class JoystreamLibError extends Error {
  name: JoystreamLibErrorType
  details: unknown
  constructor({ name, message, details }: JoystreamLibErrorArgs) {
    super(message)
    this.name = name
    this.details = details
  }
}
