import {
  ChannelMetadata,
  IChannelMetadata,
  ILicense,
  IMediaType,
  IMembershipMetadata,
  IPublishedBeforeJoystream,
  IVideoMetadata,
  MembershipMetadata,
  VideoMetadata,
} from '@joystream/metadata-protobuf'
import { createType } from '@joystream/types'
import { ApiPromise as PolkadotApi } from '@polkadot/api'
import { Bytes, Option } from '@polkadot/types'
import { PalletContentStorageAssetsRecord } from '@polkadot/types/lookup'
import Long from 'long'

import { prepareAssetsForExtrinsic } from './helpers'
import {
  ChannelInputAssets,
  ChannelInputMetadata,
  DataObjectMetadata,
  MemberInputMetadata,
  VideoInputAssets,
  VideoInputMetadata,
} from './types'

type ParseExtrinsicInputFn<TMetadata, TAssets> = (
  api: PolkadotApi,
  inputMetadata: TMetadata,
  inputAssets: TAssets
) => Promise<[Option<Bytes>, TAssets extends undefined ? undefined : Option<PalletContentStorageAssetsRecord>]>

export const wrapMetadata = (metadata: Uint8Array): Option<Bytes> => {
  const metadataRaw = createType('Raw', metadata)
  const metadataBytes = createType('Bytes', metadataRaw)
  return createType('Option<Bytes>', metadataBytes)
}

export const parseVideoExtrinsicInput: ParseExtrinsicInputFn<VideoInputMetadata, VideoInputAssets> = async (
  api,
  inputMetadata,
  inputAssets
) => {
  const properties: IVideoMetadata = {}

  // prepare data objects and assign proper indexes in metadata
  const videoDataObjectsMetadata: DataObjectMetadata[] = [
    ...(inputAssets.media ? [inputAssets.media] : []),
    ...(inputAssets.thumbnailPhoto ? [inputAssets.thumbnailPhoto] : []),
  ]
  if (inputAssets.media) {
    properties.video = 0
  }
  if (inputAssets.thumbnailPhoto) {
    properties.thumbnailPhoto = inputAssets.media ? 1 : 0
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
    properties.category = Long.fromInt(inputMetadata.category)
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

  const metadata = wrapMetadata(VideoMetadata.encode(properties).finish())
  const storageAssets = await prepareAssetsForExtrinsic(api, videoDataObjectsMetadata)

  return [metadata, storageAssets]
}

export const parseChannelExtrinsicInput: ParseExtrinsicInputFn<ChannelInputMetadata, ChannelInputAssets> = async (
  api,
  inputMetadata,
  inputAssets
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

  const metadata = wrapMetadata(ChannelMetadata.encode(properties).finish())
  const storageAssets = await prepareAssetsForExtrinsic(api, channelDataObjectsMetadata)

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
