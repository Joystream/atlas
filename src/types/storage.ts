export type AssetUploadStatus = 'completed' | 'inProgress' | 'error' | 'reconnecting' | 'processing'

export type UploadStatus = {
  lastStatus?: AssetUploadStatus
  progress?: number
  retries?: number
}
