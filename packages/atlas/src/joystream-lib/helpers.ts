import { createType } from '@joystream/types'
import { ApiPromise as PolkadotApi } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { BTreeSet, Option, Vec, u64 } from '@polkadot/types'
import { Hash } from '@polkadot/types/interfaces/runtime'
import { DispatchError, Event, EventRecord } from '@polkadot/types/interfaces/system'
import {
  PalletContentNftTypesEnglishAuctionParamsRecord,
  PalletContentNftTypesInitTransactionalStatusRecord,
  PalletContentNftTypesNftIssuanceParametersRecord,
  PalletContentNftTypesOpenAuctionParamsRecord,
  PalletContentStorageAssetsRecord,
} from '@polkadot/types/lookup'
import { Registry } from '@polkadot/types/types'

import { SentryLogger } from '@/utils/logs'

import { NFT_DEFAULT_BID_LOCK_DURATION, NFT_DEFAULT_EXTENSION_PERIOD, NFT_PERBILL_PERCENT } from './config'
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

export const prepareAssetsForExtrinsic = async (
  api: PolkadotApi,
  dataObjectsMetadata: DataObjectMetadata[]
): Promise<Option<PalletContentStorageAssetsRecord>> => {
  if (!dataObjectsMetadata.length) {
    return createType('Option<PalletContentStorageAssetsRecord>', null)
  }

  const feePerMB = await api.query.storage.dataObjectPerMegabyteFee()

  const mappedDataObjectMetadata = dataObjectsMetadata.map((metadata) =>
    createType('PalletStorageDataObjectCreationParameters', {
      size_: metadata.size,
      ipfsContentId: createType('Bytes', metadata.ipfsHash),
    })
  )
  const dataObjectsVec = createType('Vec<PalletStorageDataObjectCreationParameters>', mappedDataObjectMetadata)

  const storageAssets = createType('PalletContentStorageAssetsRecord', {
    objectCreationList: dataObjectsVec,
    expectedDataSizeFee: feePerMB,
  })
  return createType('Option<PalletContentStorageAssetsRecord>', storageAssets)
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
  events: Event[]
  blockHash: Hash
  transactionHash: string
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

    // { nonce: -1 } takes txs pending in the pool into account when sending a tx
    // see more here: https://polkadot.js.org/docs/api/cookbook/tx/#how-do-i-take-the-pending-tx-pool-into-account-in-my-nonce
    tx.signAndSend(accountId, { nonce: -1 }, (result) => {
      const extrinsicsHash = tx.hash.toHex()
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
          `extrinsic hash: ${extrinsicsHash}`,
          `more details at: https://polkadot.js.org/apps/?rpc=${endpoint}#/explorer/query/${hash}`,
        ].join('\n')
      }

      if (status.isFinalized) {
        unsub()
        SentryLogger.message(`Successful transaction: ${transactionInfo}`, 'JoystreamJs', 'info')

        try {
          const events = parseExtrinsicEvents(registry, rawEvents)
          resolve({ events, blockHash: status.asFinalized, transactionHash: extrinsicsHash })
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

export const getReplacedDataObjectsIds = (assets: VideoInputAssets | ChannelInputAssets): BTreeSet<u64> =>
  createType(
    'BTreeSet<u64>',
    Object.values(assets)
      .filter((asset): asset is Required<DataObjectMetadata> => !!asset.replacedDataObjectId)
      .map((asset) => asset.replacedDataObjectId)
  )

const getResultVideoDataObjectsIds = (assets: VideoAssets<unknown>, dataObjectsIds: Vec<u64>): VideoAssetsIds => {
  const ids = dataObjectsIds.map((dataObjectsId) => dataObjectsId.toString())

  const hasMedia = !!assets.media
  const hasThumbnail = !!assets.thumbnailPhoto

  return {
    ...(hasMedia ? { media: ids[0] } : {}),
    ...(hasThumbnail ? { thumbnailPhoto: ids[hasMedia ? 1 : 0] } : {}),
  }
}

const getResultChannelDataObjectsIds = (assets: ChannelAssets<unknown>, dataObjectsIds: Vec<u64>): ChannelAssetsIds => {
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

const createCommonAuctionParams = (inputMetadata: NftAuctionInputMetadata) => {
  return {
    startingPrice: createType('u128', inputMetadata.startingPrice),
    buyNowPrice: createType('Option<u128>', inputMetadata.buyNowPrice),
    startsAt: createType('Option<u32>', inputMetadata.startsAtBlock),
    whitelist: createType('BTreeSet<u64>', inputMetadata.whitelistedMembersIds || []),
  }
}

export const createNftOpenAuctionParams = (
  inputMetadata: NftOpenAuctionInputMetadata
): PalletContentNftTypesOpenAuctionParamsRecord => {
  return createType('PalletContentNftTypesOpenAuctionParamsRecord', {
    ...createCommonAuctionParams(inputMetadata),
    bidLockDuration: createType('u32', inputMetadata.bidLockDuration ?? NFT_DEFAULT_BID_LOCK_DURATION),
  })
}

export const createNftEnglishAuctionParams = (
  inputMetadata: NftEnglishAuctionInputMetadata
): PalletContentNftTypesEnglishAuctionParamsRecord => {
  return createType('PalletContentNftTypesEnglishAuctionParamsRecord', {
    ...createCommonAuctionParams(inputMetadata),
    duration: createType('u32', inputMetadata.auctionDurationBlocks),
    extensionPeriod: createType('u32', inputMetadata.extensionPeriodBlocks ?? NFT_DEFAULT_EXTENSION_PERIOD),
    minBidStep: createType('u128', inputMetadata.minimalBidStep),
  })
}

const createNftIssuanceTransactionalStatus = (
  inputMetadata: NftIssuanceInputMetadata
): PalletContentNftTypesInitTransactionalStatusRecord => {
  if (!inputMetadata.sale) {
    return createType('PalletContentNftTypesInitTransactionalStatusRecord', { Idle: null })
  }

  if (inputMetadata.sale.type === 'buyNow') {
    return createType('PalletContentNftTypesInitTransactionalStatusRecord', {
      BuyNow: createType('u128', inputMetadata.sale.buyNowPrice),
    })
  } else if (inputMetadata.sale.type === 'open') {
    return createType('PalletContentNftTypesInitTransactionalStatusRecord', {
      OpenAuction: createNftOpenAuctionParams(inputMetadata.sale),
    })
  } else if (inputMetadata.sale.type === 'english') {
    return createType('PalletContentNftTypesInitTransactionalStatusRecord', {
      EnglishAuction: createNftEnglishAuctionParams(inputMetadata.sale),
    })
  } else {
    throw new JoystreamLibError({ name: 'UnknownError', message: `Unknown sale type`, details: { inputMetadata } })
  }
}

export const createNftIssuanceParameters = (
  inputMetadata?: NftIssuanceInputMetadata
): Option<PalletContentNftTypesNftIssuanceParametersRecord> => {
  if (!inputMetadata) {
    return createType('Option<PalletContentNftTypesNftIssuanceParametersRecord>', null)
  }

  const initTransactionalStatus = createNftIssuanceTransactionalStatus(inputMetadata)

  return createType('Option<PalletContentNftTypesNftIssuanceParametersRecord>', {
    nftMetadata: createType('Bytes', '0x0'),
    royalty: createType(
      'Option<u64>',
      inputMetadata.royalty ? createType('u64', inputMetadata.royalty * NFT_PERBILL_PERCENT) : null
    ),
    nonChannelOwner: createType('Option<u64>', null),
    initTransactionalStatus: initTransactionalStatus,
  })
}
