import { GenericEvent } from '@polkadot/types'

export class ExtrinsicUnknownError extends Error {}
export class ExtrinsicFailedError extends Error {
  extrinsicFailedEvent: GenericEvent

  constructor(event: GenericEvent) {
    super()
    this.extrinsicFailedEvent = event
  }
}

export class AccountNotFoundError extends Error {}
export class AccountNotSelectedError extends Error {}

export class ExtensionNotFoundError extends Error {}
export class ExtensionUnknownError extends Error {}
export class ExtensionSignCancelledError extends Error {}
