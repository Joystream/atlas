import { StorageDataObjectFieldsFragment } from '@/api/queries'

export type DataObjectType = StorageDataObjectFieldsFragment['type']['__typename']

export type AssetUploadStatus = 'completed' | 'inProgress' | 'error' | 'reconnecting' | 'processing'

export type UploadStatus = {
  lastStatus?: AssetUploadStatus
  progress?: number
  retries?: number
}

export type DistributorInfo = {
  id: string
  endpoint: string
}
