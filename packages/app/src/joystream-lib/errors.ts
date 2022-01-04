import { GenericEvent } from '@polkadot/types'

export class ApiNotConnectedError extends Error {}

export class ExtrinsicUnknownError extends Error {}
export class ExtrinsicFailedError extends Error {
  extrinsicFailedEvent: GenericEvent
  voucherSizeLimitExceeded: boolean

  constructor(event: GenericEvent, message?: string, voucherSizeLimitExceeded = false) {
    super(message)
    this.extrinsicFailedEvent = event
    this.voucherSizeLimitExceeded = voucherSizeLimitExceeded
  }
}
export class ExtrinsicSignCancelledError extends Error {}

export class AccountNotSelectedError extends Error {}
