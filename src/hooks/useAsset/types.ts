import {
  AllChannelFieldsFragment,
  AssetAvailability,
  BasicChannelFieldsFragment,
  DataObject,
  VideoFieldsFragment,
} from '@/api/queries'
import { AssetType } from '@/hooks'

export type UseAssetDataArgs =
  | { entity?: VideoFieldsFragment | null; assetType: AssetType.THUMBNAIL | AssetType.MEDIA }
  | { entity?: AllChannelFieldsFragment | null; assetType: AssetType.COVER | AssetType.AVATAR }
  | { entity?: BasicChannelFieldsFragment | null; assetType: AssetType.AVATAR }

export type UseAssetData = {
  url?: string
  error: ErrorEvent | null
  isLoading: boolean
}

export type UseAsset = (args: UseAssetDataArgs) => UseAssetData

export type AssetData = {
  availability: AssetAvailability
  urls: string[]
  dataObject?: DataObject | null
}
