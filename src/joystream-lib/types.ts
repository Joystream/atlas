import { ChannelMetadata, VideoMetadata } from '@joystream/content-metadata-protobuf'
import { NewAsset } from '@joystream/types/content'

export type AccountId = string
export type MemberId = string
export type ChannelId = string
export type VideoId = string

export type AssetMetadata = {
  size: number
  ipfsContentId: string
}

export type CreateChannelMetadata = Omit<ChannelMetadata.AsObject, 'coverPhoto' | 'avatarPhoto' | 'category'>
export type ChannelAssets = {
  cover?: NewAsset
  avatar?: NewAsset
}

export type CreateVideoMetadata = Omit<
  VideoMetadata.AsObject,
  'thumbnailPhoto' | 'video' | 'personsList' | 'mediaType' | 'publishedBeforeJoystream' | 'license'
> & {
  publishedBeforeJoystream?: string
  mimeMediaType?: string
}
export type VideoAssets = {
  thumbnail?: NewAsset
  video?: NewAsset
}

export enum ExtrinsicStatus {
  ProcessingAssets,
  Unsigned,
  Signed,
  Syncing,
  Completed,
  Error,
}
export type ExtrinsicStatusCallbackFn = (status: ExtrinsicStatus) => void
export type ExtrinsicResult<T> = {
  block: number
  data: T
}
