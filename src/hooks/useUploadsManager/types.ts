import { ChannelId, VideoId } from '@/joystream-lib'
import { AssetDimensions, ImageCropData } from '@/types/cropper'

type AssetType = 'video' | 'thumbnail' | 'cover' | 'avatar'
export type AssetParent = 'video' | 'channel'

export type AssetUploadStatus = 'completed' | 'inProgress' | 'error' | 'reconnecting' | 'missing'

export type AssetUpload = {
  contentId: string
  ipfsContentId?: string
  parentObject: {
    type: AssetParent
    id: ChannelId | VideoId
  }
  owner: ChannelId
  type: AssetType
  lastStatus: AssetUploadStatus
  // size in bytes
  size: number
  dimensions?: AssetDimensions
  imageCropData?: ImageCropData
  metadata?: string
}
export type AssetUploadWithProgress = AssetUpload & {
  // progress of upload - 0...1
  progress: number
}
export type InputAssetUpload = Omit<AssetUpload, 'lastStatus' | 'size'>

export type UploadsManagerState = AssetUpload[]

export type StartFileUploadOptions = {
  isReUpload?: boolean
  changeHost?: boolean
}

export type UploadManagerValue = {
  chanelUploadsState: AssetUpload[]
  isLoading: boolean
}
export type UploadsProgressRecord = Record<string, number>
