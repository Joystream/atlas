import {
  ChannelMetadata,
  License,
  MediaType,
  PublishedBeforeJoystream,
  VideoMetadata,
} from '@joystream/content-metadata-protobuf'
import { StorageAssets } from '@joystream/types/content'
import { ApiPromise as PolkadotApi } from '@polkadot/api'
import { Bytes, Option, Raw } from '@polkadot/types'

import { prepareAssetsForExtrinsic } from './helpers'
import {
  ChannelInputAssets,
  ChannelInputMetadata,
  DataObjectMetadata,
  VideoInputAssets,
  VideoInputMetadata,
} from './types'

export const parseVideoExtrinsicInput = async (
  api: PolkadotApi,
  inputMetadata: VideoInputMetadata,
  inputAssets: VideoInputAssets
) => {
  const videoMetadata = new VideoMetadata()

  // prepare data objects and assign proper indexes in metadata
  const videoDataObjectsMetadata: DataObjectMetadata[] = [
    ...(inputAssets.media ? [inputAssets.media] : []),
    ...(inputAssets.thumbnailPhoto ? [inputAssets.thumbnailPhoto] : []),
  ]
  const videoStorageAssets = await prepareAssetsForExtrinsic(api, videoDataObjectsMetadata)
  if (inputAssets.media) {
    videoMetadata.setVideo(0)
  }
  if (inputAssets.thumbnailPhoto) {
    videoMetadata.setThumbnailPhoto(inputAssets.media ? 1 : 0)
  }

  if (inputMetadata.title != null) {
    videoMetadata.setTitle(inputMetadata.title)
  }
  if (inputMetadata.description != null) {
    videoMetadata.setDescription(inputMetadata.description)
  }
  if (inputMetadata.isPublic != null) {
    videoMetadata.setIsPublic(inputMetadata.isPublic)
  }
  if (inputMetadata.language != null) {
    videoMetadata.setLanguage(inputMetadata.language)
  }
  if (inputMetadata.isExplicit != null) {
    videoMetadata.setIsExplicit(inputMetadata.isExplicit)
  }
  if (inputMetadata.category != null) {
    videoMetadata.setCategory(inputMetadata.category)
  }
  if (inputMetadata.duration != null) {
    videoMetadata.setDuration(inputMetadata.duration)
  }
  if (inputMetadata.mediaPixelHeight != null) {
    videoMetadata.setMediaPixelHeight(inputMetadata.mediaPixelHeight)
  }
  if (inputMetadata.mediaPixelWidth != null) {
    videoMetadata.setMediaPixelWidth(inputMetadata.mediaPixelWidth)
  }
  if (inputMetadata.hasMarketing != null) {
    videoMetadata.setHasMarketing(inputMetadata.hasMarketing)
  }

  if (inputMetadata.license) {
    const videoLicenseMetadata = new License()
    if (inputMetadata.license.code != null) {
      videoLicenseMetadata.setCode(inputMetadata.license.code)
    }
    if (inputMetadata.license.attribution != null) {
      videoLicenseMetadata.setAttribution(inputMetadata.license.attribution)
    }
    if (inputMetadata.license.customText != null) {
      videoLicenseMetadata.setCustomText(inputMetadata.license.customText)
    }
    videoMetadata.setLicense(videoLicenseMetadata)
  }

  if (inputMetadata.mimeMediaType != null) {
    const videoMediaTypeMetadata = new MediaType()
    videoMediaTypeMetadata.setMimeMediaType(inputMetadata.mimeMediaType)
    videoMetadata.setMediaType(videoMediaTypeMetadata)
  }

  if (inputMetadata.publishedBeforeJoystream != null) {
    const protoPublishedBeforeJoystream = new PublishedBeforeJoystream()
    protoPublishedBeforeJoystream.setIsPublished(true)
    protoPublishedBeforeJoystream.setDate(inputMetadata.publishedBeforeJoystream)
    videoMetadata.setPublishedBeforeJoystream(protoPublishedBeforeJoystream)
  }

  const serializedVideoMetadata = videoMetadata.serializeBinary()
  const videoMetadataRaw = new Raw(api.registry, serializedVideoMetadata)
  const videoMetadataBytes = new Bytes(api.registry, videoMetadataRaw)
  const optionalVideoMetadataBytes = new Option(api.registry, Bytes, videoMetadataBytes)

  const optionalVideoStorageAssets = new Option(api.registry, StorageAssets, videoStorageAssets)

  return [optionalVideoMetadataBytes, optionalVideoStorageAssets] as const
}

export const parseChannelExtrinsicInput = async (
  api: PolkadotApi,
  inputMetadata: ChannelInputMetadata,
  inputAssets: ChannelInputAssets
) => {
  const channelMetadata = new ChannelMetadata()

  // prepare data objects and assign proper indexes in metadata
  const channelDataObjectsMetadata: DataObjectMetadata[] = [
    ...(inputAssets.avatarPhoto ? [inputAssets.avatarPhoto] : []),
    ...(inputAssets.coverPhoto ? [inputAssets.coverPhoto] : []),
  ]
  const channelStorageAssets = await prepareAssetsForExtrinsic(api, channelDataObjectsMetadata)
  if (inputAssets.avatarPhoto) {
    channelMetadata.setAvatarPhoto(0)
  }
  if (inputAssets.coverPhoto) {
    channelMetadata.setCoverPhoto(inputAssets.avatarPhoto ? 1 : 0)
  }

  if (inputMetadata.title != null) {
    channelMetadata.setTitle(inputMetadata.title)
  }
  if (inputMetadata.description != null) {
    channelMetadata.setDescription(inputMetadata.description)
  }
  if (inputMetadata.isPublic != null) {
    channelMetadata.setIsPublic(inputMetadata.isPublic)
  }
  if (inputMetadata.language != null) {
    channelMetadata.setLanguage(inputMetadata.language)
  }

  const serializedChannelMetadata = channelMetadata.serializeBinary()
  const channelMetadataRaw = new Raw(api.registry, serializedChannelMetadata)
  const channelMetadataBytes = new Bytes(api.registry, channelMetadataRaw)
  const optionalChannelMetadataBytes = new Option(api.registry, Bytes, channelMetadataBytes)

  const optionalChannelStorageAssets = new Option(api.registry, StorageAssets, channelStorageAssets)

  return [optionalChannelMetadataBytes, optionalChannelStorageAssets] as const
}
