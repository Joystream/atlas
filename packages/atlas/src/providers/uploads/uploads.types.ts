import { ChannelId, VideoId } from '@/joystream-lib/types'
import { AssetDimensions, ImageCropData } from '@/types/cropper'
import { UploadStatus } from '@/types/storage'

type AssetType = 'video' | 'thumbnail' | 'cover' | 'avatar' | 'subtitles'
export type AssetParent = 'video' | 'channel'

export type AssetUpload = {
  id: string
  ipfsHash?: string
  parentObject: {
    type: AssetParent
    id: ChannelId | VideoId
    title?: string | null
    ytVideoId?: string | null
  }
  owner: ChannelId
  type: AssetType
  // size in bytes
  size: string
  dimensions?: AssetDimensions
  imageCropData?: ImageCropData
  subtitlesLanguageIso?: string
  metadata?: string
  name?: string
  hasNft?: boolean
}
export type InputAssetUpload = Omit<AssetUpload, 'size'>

export type StartFileUploadOptions = {
  isReUpload?: boolean
  changeHost?: boolean
  hasNft?: boolean
  retry?: number
}

export type UploadsStatusRecord = Record<string, UploadStatus | undefined>
