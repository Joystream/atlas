import { Hash } from '@joystream/types/common'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { GenericEvent, TypeRegistry } from '@polkadot/types'
import { DispatchError, Event, EventRecord } from '@polkadot/types/interfaces/system'

import { SentryLogger } from '@/utils/logs'

import { ExtrinsicFailedError, ExtrinsicUnknownError } from './errors'
import { ExtrinsicStatus, ExtrinsicStatusCallbackFn } from './types'

export const parseExtrinsicEvents = (registry: TypeRegistry, eventRecords: EventRecord[]): Event[] => {
  const events = eventRecords.map((record) => record.event)
  const systemEvents = events.filter((event) => event.section === 'system')

  for (const event of systemEvents) {
    if (event.method === 'ExtrinsicFailed') {
      const errorMsg = extractExtrinsicErrorMsg(registry, event)
      throw new ExtrinsicFailedError(event, errorMsg, errorMsg.includes('VoucherSizeLimitExceeded'))
    } else if (event.method === 'ExtrinsicSuccess') {
      return events
    } else {
      SentryLogger.message('Unknown extrinsic event', 'JoystreamJs', 'warning', {
        event: { method: event.method },
      })
    }
  }

  throw new ExtrinsicUnknownError("Finalized extrinsic didn't fail or succeed", events)
}

const extractExtrinsicErrorMsg = (registry: TypeRegistry, event: Event) => {
  const dispatchError = event.data[0] as DispatchError
  let errorMsg = dispatchError.toString()
  if (dispatchError.isModule) {
    try {
      const { name, documentation } = registry.findMetaError(dispatchError.asModule)
      errorMsg = `${name} (${documentation})`
    } catch (e) {
      // This probably means we don't have this error in the metadata
      // In this case - continue (we'll just display dispatchError.toString())
    }
  }
  return errorMsg
}

export const sendExtrinsicAndParseEvents = (
  tx: SubmittableExtrinsic<'promise'>,
  accountId: string,
  registry: TypeRegistry,
  cb?: ExtrinsicStatusCallbackFn
) =>
  new Promise<{ events: GenericEvent[]; blockHash: Hash }>((resolve, reject) => {
    let unsub: () => void
    tx.signAndSend(accountId, (result) => {
      const { status, isError, events: rawEvents } = result

      if (isError) {
        unsub()

        reject(new ExtrinsicUnknownError('Unknown extrinsic error!'))
        return
      }

      if (status.isFinalized) {
        unsub()

        const events = parseExtrinsicEvents(registry, rawEvents)
        resolve({ events, blockHash: status.asFinalized })
      }
    })
      .then((unsubFn) => {
        // if signAndSend succeeded, report back to the caller with the update
        cb?.(ExtrinsicStatus.Signed)
        unsub = unsubFn
      })
      .catch((e) => reject(e))
  })
