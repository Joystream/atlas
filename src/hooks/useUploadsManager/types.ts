import { IAssetUpload } from '@/models/UploadsManagerStore'

export type AssetUploadStatus = 'completed' | 'inProgress' | 'error' | 'reconnecting' | 'reconnectionError'

export type StartFileUploadOptions = {
  isReUpload?: boolean
  changeHost?: boolean
}

export type UploadManagerValue = {
  uploadsState: IAssetUpload[][]
  startFileUpload: (
    file: File | Blob | null,
    asset: IAssetUpload,
    storageMetadata: string,
    opts?: StartFileUploadOptions
  ) => void
  isLoading: boolean
}
