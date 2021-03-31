import { ChannelMetadata } from '@joystream/content-metadata-protobuf'

export type AccountId = string
export type Account = {
  id: AccountId
  name: string
}
export type MemberId = number
export type ChannelId = number

export type AssetMetadata = {
  size: number
  ipfsContentId: string
}

export type UpdateChannelMetadata = Omit<ChannelMetadata.AsObject, 'coverPhoto' | 'avatarPhoto' | 'category'>
export type CreateChannelMetadata = Required<UpdateChannelMetadata>
export type ChannelAssets = {
  cover?: AssetMetadata
  avatar?: AssetMetadata
}

export enum ExtrinsicStatus {
  Signed,
}
export type ExtrinsicStatusCallbackFn = (status: ExtrinsicStatus) => void
