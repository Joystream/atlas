import {
  AllChannelFieldsFragment,
  AssetAvailability,
  BasicChannelFieldsFragment,
  BasicVideoFieldsFragment,
  DataObjectFieldsFragment,
  VideoFieldsFragment,
} from '@/api/queries'

export enum AssetType {
  COVER = 'cover',
  AVATAR = 'avatar',
  THUMBNAIL = 'thumbnail',
  MEDIA = 'media',
}

export type UseAssetDataArgs =
  | { entity?: BasicVideoFieldsFragment | null; assetType: AssetType.THUMBNAIL }
  | { entity?: VideoFieldsFragment | null; assetType: AssetType.THUMBNAIL | AssetType.MEDIA }
  | { entity?: AllChannelFieldsFragment | null; assetType: AssetType.COVER | AssetType.AVATAR }
  | { entity?: BasicChannelFieldsFragment | null; assetType: AssetType.AVATAR }

export type UseAssetData = {
  url?: string
}

export type UseAsset = (args: UseAssetDataArgs) => UseAssetData

export type AssetResolutionData = {
  availability: AssetAvailability
  urls?: string[]
  dataObject?: DataObjectFieldsFragment | null
  assetType: AssetType
}
