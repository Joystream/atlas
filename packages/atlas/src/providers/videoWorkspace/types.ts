import BN from 'bn.js'

import { ImageInputMetadata, MediaInputMetadata } from '@/components/_inputs/MultiFileSelect'
import { NftIssuanceInputMetadata, VideoAssets, VideoInputMetadata } from '@/joystream-lib/types'
import { AssetDimensions, ImageCropData } from '@/types/cropper'
import { SubtitlesInput } from '@/types/subtitles'

export type VideoWorkspaceVideoAssets = {
  video: {
    url?: string | undefined | null
    id: string | null
    blob?: File | null
  } & MediaInputMetadata
  thumbnail: {
    url?: string | undefined | null
    cropId: string | null
    originalId: string | null
    blob?: Blob
    originalBlob?: Blob | File | null
  } & ImageInputMetadata
}

export type VideoWorkspace = {
  id: string
  isDraft?: boolean
  isNew?: boolean
  mintNft?: boolean
}

export type ContextValue = {
  editedVideoInfo: VideoWorkspace
  setEditedVideo: (video?: VideoWorkspace) => void
  isWorkspaceOpen: boolean
  setIsWorkspaceOpen: (open: boolean) => void
  uploadVideoButtonProps: {
    to?: string
    onClick: () => void
  }
}

export type VideoWorkspaceVideoFormFields = {
  title: string
  description: string
  language: string | null
  category: string | null
  licenseCode: number | null
  licenseCustomText: string | null
  licenseAttribution: string | null
  hasMarketing: boolean | null
  isPublic: boolean | null
  isExplicit: boolean
  mintNft: boolean
  nftRoyaltiesPercent?: number
  enableComments?: boolean
  publishedBeforeJoystream: Date | null
  subtitlesArray: SubtitlesInput[] | null
  assets: VideoWorkspaceVideoAssets
}

export type VideoFormAssetData = {
  id: string
  originalId?: string
  hashPromise: Promise<string>
  blob: Blob
  url?: string
  dimensions?: AssetDimensions
  cropData?: ImageCropData
  subtitlesLanguageIso?: string
  name?: string
}

export type VideoFormAssets = VideoAssets<VideoFormAssetData>

export type VideoFormData = {
  metadata: VideoInputMetadata
  nftMetadata?: NftIssuanceInputMetadata
  assets: VideoFormAssets
}

export type VideoWorkspaceFormStatus = {
  isValid: boolean
  isDirty: boolean
  isDisabled: boolean
  hasUnsavedAssets: boolean
  actionBarPrimaryText: string
  actionBarFee?: BN
  actionBarFeeLoading?: boolean
  triggerFormSubmit: () => void
}
