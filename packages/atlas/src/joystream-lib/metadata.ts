import {
  ChannelMetadata,
  ContentMetadata,
  IChannelMetadata,
  ILicense,
  IMediaType,
  IMembershipMetadata,
  IPublishedBeforeJoystream,
  ITokenMetadata,
  IVideoMetadata,
  MembershipMetadata,
  TokenMetadata,
} from '@joystream/metadata-protobuf'
import { createType } from '@joystream/types'
import { ApiPromise as PolkadotApi } from '@polkadot/api'
import { Bytes, Option } from '@polkadot/types'
import { PalletContentStorageAssetsRecord } from '@polkadot/types/lookup'

import { prepareAssetsForExtrinsic } from './helpers'
import {
  ChannelInputAssets,
  ChannelInputMetadata,
  DataObjectMetadata,
  MemberInputMetadata,
  RawMetadataProcessorFn,
  VideoInputAssets,
  VideoInputMetadata,
} from './types'

type ParseExtrinsicInputFn<TMetadata, TAssets> = (
  api: PolkadotApi,
  inputMetadata: TMetadata,
  inputAssets: TAssets,
  rawMetadataProcessor?: RawMetadataProcessorFn
) => Promise<[Option<Bytes>, TAssets extends undefined ? undefined : Option<PalletContentStorageAssetsRecord>]>

const VIDEO_ASSETS_ORDER: (keyof VideoInputAssets)[] = ['media', 'thumbnailPhoto', 'subtitles']

export const wrapMetadata = (metadata: Uint8Array): Option<Bytes> => {
  const metadataRaw = createType('Raw', metadata)
  const metadataBytes = createType('Bytes', metadataRaw)
  return createType('Option<Bytes>', metadataBytes)
}

type VideoAssetIndexMap = {
  media?: number
  thumbnailPhoto?: number
  subtitles: Record<string, number>
}

const prepareVideoAssets = (inputAssets: VideoInputAssets): [DataObjectMetadata[], VideoAssetIndexMap] => {
  let assetsCounter = 0
  const dataObjectsMetadata: DataObjectMetadata[] = []
  const indexMap = { subtitles: {} } as VideoAssetIndexMap

  VIDEO_ASSETS_ORDER.forEach((assetKey) => {
    const entry = inputAssets[assetKey]
    if (!entry) {
      return
    }

    if (assetKey === 'subtitles') {
      const arrayEntry = entry as DataObjectMetadata[]
      arrayEntry.forEach((asset) => {
        indexMap[assetKey][asset.id || ''] = assetsCounter
        dataObjectsMetadata.push(asset)
        assetsCounter++
      })
    } else {
      const singleEntry = entry as DataObjectMetadata
      indexMap[assetKey] = assetsCounter
      dataObjectsMetadata.push(singleEntry)
      assetsCounter++
    }
  })
  return [dataObjectsMetadata, indexMap]
}

export const parseVideoExtrinsicInput: ParseExtrinsicInputFn<VideoInputMetadata, VideoInputAssets> = async (
  api,
  inputMetadata,
  inputAssets,
  rawMetadataProcessor
) => {
  const properties: IVideoMetadata = {}

  const [videoDataObjectsMetadata, videoAssetsIndexMap] = prepareVideoAssets(inputAssets)

  if (videoAssetsIndexMap.media != null) {
    properties.video = videoAssetsIndexMap.media
  }
  if (videoAssetsIndexMap.thumbnailPhoto != null) {
    properties.thumbnailPhoto = videoAssetsIndexMap.thumbnailPhoto
  }
  properties.subtitles = inputMetadata.subtitles?.map((subtitle) => ({
    ...subtitle,
    newAsset: videoAssetsIndexMap.subtitles[subtitle.id],
  }))
  if (inputMetadata.clearSubtitles) {
    properties.clearSubtitles = true
  }

  if (inputMetadata.title != null) {
    properties.title = inputMetadata.title
  }
  if (inputMetadata.description != null) {
    properties.description = inputMetadata.description
  }
  if (inputMetadata.isPublic != null) {
    properties.isPublic = inputMetadata.isPublic
  }
  if (inputMetadata.language != null) {
    properties.language = inputMetadata.language
  }
  if (inputMetadata.isExplicit != null) {
    properties.isExplicit = inputMetadata.isExplicit
  }
  if (inputMetadata.category != null) {
    properties.category = inputMetadata.category
  }
  if (inputMetadata.duration != null) {
    properties.duration = inputMetadata.duration
  }
  if (inputMetadata.mediaPixelHeight != null) {
    properties.mediaPixelHeight = inputMetadata.mediaPixelHeight
  }
  if (inputMetadata.mediaPixelWidth != null) {
    properties.mediaPixelWidth = inputMetadata.mediaPixelWidth
  }
  if (inputMetadata.hasMarketing != null) {
    properties.hasMarketing = inputMetadata.hasMarketing
  }

  if (inputMetadata.license) {
    const videoLicenseProperties: ILicense = {}
    if (inputMetadata.license.code != null) {
      videoLicenseProperties.code = inputMetadata.license.code
    }
    if (inputMetadata.license.attribution != null) {
      videoLicenseProperties.attribution = inputMetadata.license.attribution
    }
    if (inputMetadata.license.customText != null) {
      videoLicenseProperties.customText = inputMetadata.license.customText
    }

    properties.license = videoLicenseProperties
  }
  if (inputMetadata.enableComments != null) {
    properties.enableComments = inputMetadata.enableComments
  }

  if (inputMetadata.mimeMediaType != null) {
    const videoMediaTypeProperties: IMediaType = {}
    videoMediaTypeProperties.mimeMediaType = inputMetadata.mimeMediaType
    properties.mediaType = videoMediaTypeProperties
  }

  if (inputMetadata.publishedBeforeJoystream != null) {
    const videoPublishedBeforeProperties: IPublishedBeforeJoystream = {}
    videoPublishedBeforeProperties.isPublished = true
    videoPublishedBeforeProperties.date = inputMetadata.publishedBeforeJoystream
    properties.publishedBeforeJoystream = videoPublishedBeforeProperties
  }

  const storageAssets = await prepareAssetsForExtrinsic(api, videoDataObjectsMetadata)
  const encodedMetadata = ContentMetadata.encode({ videoMetadata: properties }).finish()
  const metadata = rawMetadataProcessor
    ? wrapMetadata(await rawMetadataProcessor(encodedMetadata, storageAssets.toU8a()))
    : wrapMetadata(encodedMetadata)

  return [metadata, storageAssets]
}

export const parseChannelExtrinsicInput: ParseExtrinsicInputFn<ChannelInputMetadata, ChannelInputAssets> = async (
  api,
  inputMetadata,
  inputAssets,
  rawMetadataProcessor
) => {
  const properties: IChannelMetadata = {}

  // prepare data objects and assign proper indexes in metadata
  const channelDataObjectsMetadata: DataObjectMetadata[] = [
    ...(inputAssets.avatarPhoto ? [inputAssets.avatarPhoto] : []),
    ...(inputAssets.coverPhoto ? [inputAssets.coverPhoto] : []),
  ]
  if (inputAssets.avatarPhoto) {
    properties.avatarPhoto = 0
  }
  if (inputAssets.coverPhoto) {
    properties.coverPhoto = inputAssets.avatarPhoto ? 1 : 0
  }

  if (inputMetadata.title != null) {
    properties.title = inputMetadata.title
  }
  if (inputMetadata.description != null) {
    properties.description = inputMetadata.description
  }
  if (inputMetadata.isPublic != null) {
    properties.isPublic = inputMetadata.isPublic
  }
  if (inputMetadata.language != null) {
    properties.language = inputMetadata.language
  }

  const storageAssets = await prepareAssetsForExtrinsic(api, channelDataObjectsMetadata)
  const encodedMetadata = ChannelMetadata.encode(properties).finish()
  const metadata = rawMetadataProcessor
    ? wrapMetadata(await rawMetadataProcessor(encodedMetadata, storageAssets.toU8a()))
    : wrapMetadata(encodedMetadata)
  return [metadata, storageAssets]
}

export const parseMemberExtrinsicInput: ParseExtrinsicInputFn<MemberInputMetadata, undefined> = async (
  api,
  inputMetadata
) => {
  const properties: IMembershipMetadata = {}
  if (inputMetadata.name != null) {
    properties.name = inputMetadata.name
  }
  if (inputMetadata.about != null) {
    properties.about = inputMetadata.about
  }
  if (inputMetadata.avatarUri != null) {
    properties.avatarUri = inputMetadata.avatarUri
  }

  const metadata = wrapMetadata(MembershipMetadata.encode(properties).finish())

  return [metadata, undefined]
}

export const prepareCreatorTokenMetadata = (metadata: ITokenMetadata) => {
  const uInt8AMetadata = TokenMetadata.encode(metadata).finish()

  const metadataRaw = createType('Raw', uInt8AMetadata)
  const metadataBytes = createType('Bytes', metadataRaw)
  return createType('Bytes', metadataBytes)
}
