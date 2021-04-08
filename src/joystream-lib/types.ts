import { ChannelMetadata } from '@joystream/content-metadata-protobuf'

export type AccountId = string
export type Account = {
  id: AccountId
  name: string
}
export type MemberId = string
export type ChannelId = string

export type AssetMetadata = {
  size: number
  ipfsContentId: string
}

export type CreateChannelMetadata = Omit<ChannelMetadata.AsObject, 'coverPhoto' | 'avatarPhoto' | 'category'>
export type ChannelAssets = {
  cover?: AssetMetadata
  avatar?: AssetMetadata
}

export enum ExtrinsicStatus {
  ProcessingAssets,
  Unsigned,
  Signed,
  Completed,
  Error,
}
export type ExtrinsicStatusCallbackFn = (status: ExtrinsicStatus) => void
