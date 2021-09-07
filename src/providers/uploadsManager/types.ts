import { ChannelId, VideoId } from '@/joystream-lib'
import { AssetDimensions, ImageCropData } from '@/types/cropper'

type AssetType = 'video' | 'thumbnail' | 'cover' | 'avatar'
export type AssetParent = 'video' | 'channel'

export type AssetUploadStatus = 'completed' | 'inProgress' | 'error' | 'reconnecting' | 'processing'

export type AssetUpload = {
  contentId: string
  ipfsContentId?: string
  parentObject: {
    type: AssetParent
    id: ChannelId | VideoId
  }
  owner: ChannelId
  type: AssetType
  // size in bytes
  size: number
  dimensions?: AssetDimensions
  imageCropData?: ImageCropData
  metadata?: string
}
export type InputAssetUpload = Omit<AssetUpload, 'size'>

export type UploadsManagerState = AssetUpload[]

export type StartFileUploadOptions = {
  isReUpload?: boolean
  changeHost?: boolean
}

export type UploadStatus = {
  lastStatus?: AssetUploadStatus
  progress?: number
}

export type UploadsStatusRecord = Record<string, UploadStatus | undefined>
