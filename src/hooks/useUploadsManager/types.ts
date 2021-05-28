import { IAssetUpload } from '@/models/UploadsManagerStore'

export type AssetUploadStatus = 'completed' | 'inProgress' | 'error' | 'reconnecting' | 'reconnectionError'

export type UploadsManagerState = IAssetUpload[]

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
export type UploadsProgressRecord = Record<string, number>

type AddAssetAction = {
  type: 'ADD_ASSET'
  asset: IAssetUpload
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
