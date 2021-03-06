import { GenericEvent } from '@polkadot/types'

export class ApiNotConnectedError extends Error {}

export class ExtrinsicUnknownError extends Error {}
export class ExtrinsicFailedError extends Error {
  extrinsicFailedEvent: GenericEvent

  constructor(event: GenericEvent, message?: string) {
    super(message)
    this.extrinsicFailedEvent = event
  }
}
export class ExtrinsicSignCancelledError extends Error {}

export class AccountNotSelectedError extends Error {}
