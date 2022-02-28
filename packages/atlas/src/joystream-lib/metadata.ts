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
import { StorageAssets } from '@joystream/types/content'
import { ApiPromise as PolkadotApi } from '@polkadot/api'
import { Bytes, Option, Raw } from '@polkadot/types'
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
) => Promise<[Option<Bytes>, TAssets extends undefined ? undefined : Option<StorageAssets>]>

export const parseVideoExtrinsicInput: ParseExtrinsicInputFn<VideoInputMetadata, VideoInputAssets> = async (
  api,
  inputMetadata,
  inputAssets
) => {
  const videoProperties: IVideoMetadata = {}

  // prepare data objects and assign proper indexes in metadata
  const videoDataObjectsMetadata: DataObjectMetadata[] = [
    ...(inputAssets.media ? [inputAssets.media] : []),
    ...(inputAssets.thumbnailPhoto ? [inputAssets.thumbnailPhoto] : []),
  ]
  const videoStorageAssets = await prepareAssetsForExtrinsic(api, videoDataObjectsMetadata)
  if (inputAssets.media) {
    videoProperties.video = 0
  }
  if (inputAssets.thumbnailPhoto) {
    videoProperties.thumbnailPhoto = inputAssets.media ? 1 : 0
  }

  if (inputMetadata.title != null) {
    videoProperties.title = inputMetadata.title
  }
  if (inputMetadata.description != null) {
    videoProperties.description = inputMetadata.description
  }
  if (inputMetadata.isPublic != null) {
    videoProperties.isPublic = inputMetadata.isPublic
  }
  if (inputMetadata.language != null) {
    videoProperties.language = inputMetadata.language
  }
  if (inputMetadata.isExplicit != null) {
    videoProperties.isExplicit = inputMetadata.isExplicit
  }
  if (inputMetadata.category != null) {
    videoProperties.category = Long.fromInt(inputMetadata.category)
  }
  if (inputMetadata.duration != null) {
    videoProperties.duration = inputMetadata.duration
  }
  if (inputMetadata.mediaPixelHeight != null) {
    videoProperties.mediaPixelHeight = inputMetadata.mediaPixelHeight
  }
  if (inputMetadata.mediaPixelWidth != null) {
    videoProperties.mediaPixelWidth = inputMetadata.mediaPixelWidth
  }
  if (inputMetadata.hasMarketing != null) {
    videoProperties.hasMarketing = inputMetadata.hasMarketing
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

    videoProperties.license = videoLicenseProperties
  }

  if (inputMetadata.mimeMediaType != null) {
    const videoMediaTypeProperties: IMediaType = {}
    videoMediaTypeProperties.mimeMediaType = inputMetadata.mimeMediaType
    videoProperties.mediaType = videoMediaTypeProperties
  }

  if (inputMetadata.publishedBeforeJoystream != null) {
    const videoPublishedBeforeProperties: IPublishedBeforeJoystream = {}
    videoPublishedBeforeProperties.isPublished = true
    videoPublishedBeforeProperties.date = inputMetadata.publishedBeforeJoystream
    videoProperties.publishedBeforeJoystream = videoPublishedBeforeProperties
  }

  const serializedVideoMetadata = VideoMetadata.encode(videoProperties).finish()
  const videoMetadataRaw = new Raw(api.registry, serializedVideoMetadata)
  const videoMetadataBytes = new Bytes(api.registry, videoMetadataRaw)
  const optionalVideoMetadataBytes = new Option(api.registry, Bytes, videoMetadataBytes)

  const optionalVideoStorageAssets = new Option(api.registry, StorageAssets, videoStorageAssets)

  return [optionalVideoMetadataBytes, optionalVideoStorageAssets]
}

export const parseChannelExtrinsicInput: ParseExtrinsicInputFn<ChannelInputMetadata, ChannelInputAssets> = async (
  api,
  inputMetadata,
  inputAssets
) => {
  const channelProperties: IChannelMetadata = {}

  // prepare data objects and assign proper indexes in metadata
  const channelDataObjectsMetadata: DataObjectMetadata[] = [
    ...(inputAssets.avatarPhoto ? [inputAssets.avatarPhoto] : []),
    ...(inputAssets.coverPhoto ? [inputAssets.coverPhoto] : []),
  ]
  const channelStorageAssets = await prepareAssetsForExtrinsic(api, channelDataObjectsMetadata)
  if (inputAssets.avatarPhoto) {
    channelProperties.avatarPhoto = 0
  }
  if (inputAssets.coverPhoto) {
    channelProperties.coverPhoto = inputAssets.avatarPhoto ? 1 : 0
  }

  if (inputMetadata.title != null) {
    channelProperties.title = inputMetadata.title
  }
  if (inputMetadata.description != null) {
    channelProperties.description = inputMetadata.description
  }
  if (inputMetadata.isPublic != null) {
    channelProperties.isPublic = inputMetadata.isPublic
  }
  if (inputMetadata.language != null) {
    channelProperties.language = inputMetadata.language
  }

  const serializedChannelMetadata = ChannelMetadata.encode(channelProperties).finish()
  const channelMetadataRaw = new Raw(api.registry, serializedChannelMetadata)
  const channelMetadataBytes = new Bytes(api.registry, channelMetadataRaw)
  const optionalChannelMetadataBytes = new Option(api.registry, Bytes, channelMetadataBytes)

  const optionalChannelStorageAssets = new Option(api.registry, StorageAssets, channelStorageAssets)

  return [optionalChannelMetadataBytes, optionalChannelStorageAssets]
}

export const parseMemberExtrinsicInput: ParseExtrinsicInputFn<MemberInputMetadata, undefined> = async (
  api,
  inputMetadata
) => {
  const memberProperties: IMembershipMetadata = {}
  if (inputMetadata.name != null) {
    memberProperties.name = inputMetadata.name
  }
  if (inputMetadata.about != null) {
    memberProperties.about = inputMetadata.about
  }
  if (inputMetadata.avatarUri != null) {
    memberProperties.avatarUri = inputMetadata.avatarUri
  }

  const serializedMemberMetadata = MembershipMetadata.encode(memberProperties).finish()
  const memberMetadataRaw = new Raw(api.registry, serializedMemberMetadata)
  const memberMetadataBytes = new Bytes(api.registry, memberMetadataRaw)
  const optionalMemberMetadataBytes = new Option(api.registry, Bytes, memberMetadataBytes)

  return [optionalMemberMetadataBytes, undefined]
}
