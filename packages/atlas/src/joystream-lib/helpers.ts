import { DataObjectId } from '@joystream/types/augment-codec/all'
import { Hash } from '@joystream/types/common'
import { StorageAssets } from '@joystream/types/content'
import { DataObjectCreationParameters } from '@joystream/types/storage'
import { ApiPromise as PolkadotApi } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { Bytes, GenericEvent, Vec, u128 } from '@polkadot/types'
import { DispatchError, Event, EventRecord } from '@polkadot/types/interfaces/system'
import { Registry } from '@polkadot/types/types'

import { SentryLogger } from '@/utils/logs'

import {
  ChannelAssets,
  ChannelAssetsIds,
  ChannelInputAssets,
  DataObjectMetadata,
  ExtractChannelResultsAssetsIdsFn,
  ExtractVideoResultsAssetsIdsFn,
  ExtrinsicStatus,
  ExtrinsicStatusCallbackFn,
  VideoAssets,
  VideoAssetsIds,
  VideoInputAssets,
} from './'
import { JoystreamLibError } from './errors'

export const prepareAssetsForExtrinsic = async (api: PolkadotApi, dataObjectsMetadata: DataObjectMetadata[]) => {
  if (!dataObjectsMetadata.length) {
    return null
  }

  const feePerMB = await api.query.storage.dataObjectPerMegabyteFee()
  const feePerMBUint = new u128(api.registry, feePerMB)

  const mappedDataObjectMetadata = dataObjectsMetadata.map((metadata) => ({
    size: metadata.size,
    ipfsContentId: new Bytes(api.registry, metadata.ipfsHash),
  }))
  const dataObjectsVec = new Vec(api.registry, DataObjectCreationParameters, mappedDataObjectMetadata)

  return new StorageAssets(api.registry, {
    expected_data_size_fee: feePerMBUint,
    object_creation_list: dataObjectsVec,
  })
}

export const parseExtrinsicEvents = (registry: Registry, eventRecords: EventRecord[]): Event[] => {
  const events = eventRecords.map((record) => record.event)
  const systemEvents = events.filter((event) => event.section === 'system')

  for (const event of systemEvents) {
    if (event.method === 'ExtrinsicFailed') {
      const errorMsg = extractExtrinsicErrorMsg(registry, event)
      if (errorMsg.includes('VoucherSizeLimitExceeded')) {
        throw new JoystreamLibError({
          name: 'VoucherLimitError',
          message: errorMsg,
        })
      } else {
        throw new JoystreamLibError({
          name: 'FailedError',
          message: errorMsg,
        })
      }
    } else if (event.method === 'ExtrinsicSuccess') {
      return events
    } else {
      SentryLogger.message('Unknown extrinsic event', 'JoystreamJs', 'warning', {
        event: { method: event.method },
      })
    }
  }

  throw new JoystreamLibError({
    name: 'UnknownError',
    message: "Finalized extrinsic didn't fail or succeed",
    details: events,
  })
}

const extractExtrinsicErrorMsg = (registry: Registry, event: Event) => {
  const dispatchError = event.data[0] as DispatchError
  let errorMsg = dispatchError.toString()
  if (dispatchError.isModule) {
    try {
      const { name, docs } = registry.findMetaError(dispatchError.asModule)
      errorMsg = `${name} (${docs.join(', ')})`
    } catch (e) {
      // This probably means we don't have this error in the metadata
      // In this case - continue (we'll just display dispatchError.toString())
    }
  }
  return errorMsg
}

type RawExtrinsicResult = {
  events: GenericEvent[]
  blockHash: Hash
}

export const sendExtrinsicAndParseEvents = (
  tx: SubmittableExtrinsic<'promise'>,
  accountId: string,
  registry: Registry,
  cb?: ExtrinsicStatusCallbackFn
) =>
  new Promise<RawExtrinsicResult>((resolve, reject) => {
    let unsub: () => void
    tx.signAndSend(accountId, (result) => {
      const { status, isError, events: rawEvents } = result

      if (isError) {
        unsub()

        reject(new JoystreamLibError({ name: 'UnknownError', message: 'Unknown extrinsic error!' }))
        return
      }

      if (status.isFinalized) {
        unsub()

        try {
          const events = parseExtrinsicEvents(registry, rawEvents)
          resolve({ events, blockHash: status.asFinalized })
        } catch (error) {
          reject(error)
        }
      }
    })
      .then((unsubFn) => {
        // if signAndSend succeeded, report back to the caller with the update
        cb?.(ExtrinsicStatus.Signed)
        unsub = unsubFn
      })
      .catch((e) => {
        reject(e)
      })
  })

export const getInputDataObjectsIds = (assets: VideoInputAssets | ChannelInputAssets) =>
  Object.values(assets)
    .filter((asset): asset is Required<DataObjectMetadata> => !!asset.replacedDataObjectId)
    .map((asset) => asset.replacedDataObjectId)

const getResultVideoDataObjectsIds = (
  assets: VideoAssets<unknown>,
  dataObjectsIds: Vec<DataObjectId>
): VideoAssetsIds => {
  const ids = dataObjectsIds.map((dataObjectsId) => dataObjectsId.toString())

  const hasMedia = !!assets.media
  const hasThumbnail = !!assets.thumbnailPhoto

  return {
    ...(hasMedia ? { media: ids[0] } : {}),
    ...(hasThumbnail ? { thumbnailPhoto: ids[hasMedia ? 1 : 0] } : {}),
  }
}

const getResultChannelDataObjectsIds = (
  assets: ChannelAssets<unknown>,
  dataObjectsIds: Vec<DataObjectId>
): ChannelAssetsIds => {
  const ids = dataObjectsIds.map((dataObjectsId) => dataObjectsId.toString())

  const hasAvatar = !!assets.avatarPhoto
  const hasCover = !!assets.coverPhoto

  return {
    ...(hasAvatar ? { avatarPhoto: ids[0] } : {}),
    ...(hasCover ? { coverPhoto: ids[hasAvatar ? 1 : 0] } : {}),
  }
}

export const extractChannelResultAssetsIds: ExtractChannelResultsAssetsIdsFn = (inputAssets, getEventData) => {
  const anyAssetsChanged = !!Object.values(inputAssets).find((asset) => !!asset)
  try {
    const [dataObjectsIds] = getEventData('storage', 'DataObjectsUploaded')
    return getResultChannelDataObjectsIds(inputAssets, dataObjectsIds)
  } catch (error) {
    // If no assets were changed as part of this extrinsic, let's catch the missing error and ignore it. In any other case, we re-throw
    if ((error as JoystreamLibError).name === 'MissingRequiredEventError' && !anyAssetsChanged) {
      return {}
    }
    throw error
  }
}

export const extractVideoResultAssetsIds: ExtractVideoResultsAssetsIdsFn = (inputAssets, getEventData) => {
  const anyAssetsChanged = !!Object.values(inputAssets).find((asset) => !!asset)
  try {
    const [dataObjectsIds] = getEventData('storage', 'DataObjectsUploaded')
    return getResultVideoDataObjectsIds(inputAssets, dataObjectsIds)
  } catch (error) {
    // If no assets were changed as part of this extrinsic, let's catch the missing error and ignore it. In any other case, we re-throw
    if ((error as JoystreamLibError).name === 'MissingRequiredEventError' && !anyAssetsChanged) {
      return {}
    }
    throw error
  }
}
