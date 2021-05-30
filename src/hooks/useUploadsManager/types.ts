import { IAssetUpload } from '@/models/UploadsManagerStore'

export type AssetUploadStatus = 'completed' | 'inProgress' | 'error' | 'reconnecting' | 'reconnectionError'

export type StartFileUploadOptions = {
  isReUpload?: boolean
  changeHost?: boolean
}

export type UploadManagerValue = {
  uploadsState: IAssetUpload[][]
  isLoading: boolean
}
