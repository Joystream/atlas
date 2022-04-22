import { DataObjectId } from '@joystream/types/augment-codec/all'
import { Balance, BlockNumber, Hash, MemberId as RuntimeMemberId } from '@joystream/types/common'
import {
  EnglishAuctionParams,
  InitTransactionalStatus,
  NftIssuanceParameters,
  OpenAuctionParams,
  Royalty,
  StorageAssets,
} from '@joystream/types/content'
import { DataObjectCreationParameters } from '@joystream/types/storage'
import { ApiPromise as PolkadotApi } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { BTreeSet, Bytes, GenericEvent, Option, Vec, u128 } from '@polkadot/types'
import { DispatchError, Event, EventRecord } from '@polkadot/types/interfaces/system'
import { Registry } from '@polkadot/types/types'

import { SentryLogger } from '@/utils/logs'

import { NFT_DEFAULT_BID_LOCK_DURATION, NFT_DEFAULT_EXTENSION_PERIOD } from './config'
import { JoystreamLibError } from './errors'
import {
  ChannelAssets,
  ChannelAssetsIds,
  ChannelInputAssets,
  DataObjectMetadata,
  ExtractChannelResultsAssetsIdsFn,
  ExtractVideoResultsAssetsIdsFn,
  ExtrinsicStatus,
  ExtrinsicStatusCallbackFn,
  NftAuctionInputMetadata,
  NftEnglishAuctionInputMetadata,
  NftIssuanceInputMetadata,
  NftOpenAuctionInputMetadata,
  VideoAssets,
  VideoAssetsIds,
  VideoInputAssets,
} from './types'

export const NFT_PERBILL_PERCENT = 10_000_000

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

      throw new JoystreamLibError({
        name: 'FailedError',
        message: errorMsg,
      })
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
  endpoint: string,
  cb?: ExtrinsicStatusCallbackFn
) =>
  new Promise<RawExtrinsicResult>((resolve, reject) => {
    let unsub: () => void
    let transactionInfo: string
    tx.signAndSend(accountId, (result) => {
      const { status, isError, events: rawEvents } = result

      if (isError) {
        unsub()

        SentryLogger.error(`Transaction error: ${transactionInfo}`, 'JoystreamJs', 'error')
        reject(new JoystreamLibError({ name: 'UnknownError', message: 'Unknown extrinsic error!' }))
        return
      }

      if (status.isInBlock) {
        const hash = status.asInBlock.toString()
        transactionInfo = [
          rawEvents.map((event) => event.event.method).join(', '),
          `on network: ${endpoint}`,
          `in block: ${hash}`,
          `more details at: https://polkadot.js.org/apps/?rpc=${endpoint}#/explorer/query/${hash}`,
        ].join('\n')
      }

      if (status.isFinalized) {
        unsub()
        SentryLogger.message(`Successful transaction: ${transactionInfo}`, 'JoystreamJs', 'info')

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

export const getInputDataObjectsIds = (assets: VideoInputAssets | ChannelInputAssets): string[] =>
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

const createCommonAuctionParams = (registry: Registry, inputMetadata: NftAuctionInputMetadata) => {
  return {
    starting_price: new Balance(registry, inputMetadata.startingPrice),
    buy_now_price: new Option(registry, Balance, inputMetadata.buyNowPrice),
    starts_at: new Option(registry, BlockNumber, inputMetadata.startsAtBlock),
    whitelist: new BTreeSet(registry, RuntimeMemberId, inputMetadata.whitelistedMembersIds || []),
  }
}

export const createNftOpenAuctionParams = (
  registry: Registry,
  inputMetadata: NftOpenAuctionInputMetadata
): OpenAuctionParams => {
  return new OpenAuctionParams(registry, {
    ...createCommonAuctionParams(registry, inputMetadata),
    bid_lock_duration: new BlockNumber(registry, inputMetadata.bidLockDuration ?? NFT_DEFAULT_BID_LOCK_DURATION),
  })
}

export const createNftEnglishAuctionParams = (
  registry: Registry,
  inputMetadata: NftEnglishAuctionInputMetadata
): EnglishAuctionParams => {
  return new EnglishAuctionParams(registry, {
    ...createCommonAuctionParams(registry, inputMetadata),
    duration: new BlockNumber(registry, inputMetadata.auctionDurationBlocks),
    min_bid_step: new Balance(registry, inputMetadata.minimalBidStep),
    extension_period: new BlockNumber(registry, inputMetadata.extensionPeriodBlocks ?? NFT_DEFAULT_EXTENSION_PERIOD),
  })
}

const createNftIssuanceTransactionalStatus = (
  registry: Registry,
  inputMetadata: NftIssuanceInputMetadata
): InitTransactionalStatus => {
  if (!inputMetadata.sale) {
    return new InitTransactionalStatus(registry, { idle: null })
  }

  if (inputMetadata.sale.type === 'buyNow') {
    return new InitTransactionalStatus(registry, { buyNow: new Balance(registry, inputMetadata.sale.buyNowPrice) })
  } else if (inputMetadata.sale.type === 'open') {
    return new InitTransactionalStatus(registry, {
      OpenAuction: createNftOpenAuctionParams(registry, inputMetadata.sale),
    })
  } else if (inputMetadata.sale.type === 'english') {
    return new InitTransactionalStatus(registry, {
      EnglishAuction: createNftEnglishAuctionParams(registry, inputMetadata.sale),
    })
  } else {
    throw new JoystreamLibError({ name: 'UnknownError', message: `Unknown sale type`, details: { inputMetadata } })
  }
}

export const createNftIssuanceParameters = (
  registry: Registry,
  inputMetadata?: NftIssuanceInputMetadata
): NftIssuanceParameters | null => {
  if (!inputMetadata) {
    return null
  }

  const initTransactionalStatus = createNftIssuanceTransactionalStatus(registry, inputMetadata)

  return new NftIssuanceParameters(registry, {
    nft_metadata: new Bytes(registry, '0x0'),
    royalty: new Option(
      registry,
      Royalty,
      inputMetadata.royalty ? inputMetadata.royalty * NFT_PERBILL_PERCENT : undefined
    ),
    init_transactional_status: initTransactionalStatus,
    non_channel_owner: new Option(registry, RuntimeMemberId),
  })
}
