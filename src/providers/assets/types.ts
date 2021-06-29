import {
  AllChannelFieldsFragment,
  AssetAvailability,
  BasicChannelFieldsFragment,
  DataObject,
  VideoFieldsFragment,
} from '@/api/queries'

import { AssetType } from './constants'

export type UseAssetDataArgs =
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
  dataObject?: DataObject | null
  assetType: AssetType
}
