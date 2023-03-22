export type AssetUploadStatus = 'completed' | 'inProgress' | 'error' | 'reconnecting' | 'processing' | 'yt-sync'

export type UploadStatus = {
  lastStatus?: AssetUploadStatus
  progress?: number
  retries?: number
}
