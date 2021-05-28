import { ChannelId, VideoId } from '@/joystream-lib'
import { AssetDimensions, ImageCropData } from '@/types/cropper'
import { LiaisonJudgement } from '@/api/queries'

type AssetType = 'video' | 'thumbnail' | 'cover' | 'avatar'
type AssetParent = 'video' | 'channel'

export type AssetUploadStatus = 'completed' | 'inProgress' | 'error' | 'reconnecting' | 'reconnectionError'

export type AssetUpload = {
  contentId: string
  parentObject: {
    type: AssetParent
    id: ChannelId | VideoId
  }
  owner: ChannelId
  type: AssetType
  lastStatus: AssetUploadStatus
  liaisonJudgement?: LiaisonJudgement
  ipfsContentId?: string
  // size in bytes
  size: number
  dimensions?: AssetDimensions
  imageCropData?: ImageCropData
  metadata?: string
  title?: string | null
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
  uploadsState: AssetUploadWithProgress[][]
  startFileUpload: (
    file: File | Blob | null,
    asset: InputAssetUpload,
    storageMetadata: string,
    opts?: StartFileUploadOptions
  ) => void
  isLoading: boolean
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
