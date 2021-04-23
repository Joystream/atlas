import { ChannelId, VideoId } from '@/joystream-lib'
import { ImageCropData } from '@/types/cropper'

type AssetType = 'video' | 'thumbnail' | 'cover' | 'avatar'
type AssetParent = 'video' | 'channel'

export type AssetUploadStatus = 'completed' | 'inProgress' | 'error'

export type AssetUpload = {
  contentId: string
  parentObject: {
    type: AssetParent
    id: ChannelId | VideoId
  }
  owner: ChannelId
  type: AssetType
  lastStatus: AssetUploadStatus
  // size in bytes
  size: number
  imageCropData?: ImageCropData
  metadata?: string
}
export type AssetUploadWithProgress = AssetUpload & {
  // progress of upload - 0...1
  progress: number
}
export type InputAssetUpload = Omit<AssetUpload, 'lastStatus' | 'size'>

export type UploadsManagerState = AssetUpload[]

export type UploadManagerValue = {
  uploadsState: AssetUploadWithProgress[]
  startFileUpload: (file: File | Blob, asset: InputAssetUpload) => void
}
export type UploadsProgressRecord = Record<string, number>

type AddAssetAction = {
  type: 'ADD_ASSET'
  asset: AssetUpload
}
type UpdateAssetAction = {
  type: 'UPDATE_ASSET'
  contentId: string
  lastStatus?: AssetUploadStatus
}
type RemoveAssetAction = {
  type: 'REMOVE_ASSET'
  contentId: string
}
export type UploadsManagerStateAction = AddAssetAction | UpdateAssetAction | RemoveAssetAction
