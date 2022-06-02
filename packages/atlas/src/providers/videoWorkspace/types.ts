import { ImageInputMetadata, MediaInputMetadata } from '@/components/_inputs/MultiFileSelect'
import { NftIssuanceInputMetadata, VideoAssets, VideoInputMetadata } from '@/joystream-lib'
import { AssetDimensions, ImageCropData } from '@/types/cropper'

export type VideoWorkspaceVideoAssets = {
  message?: string
  video: {
    id: string | null
  } & MediaInputMetadata
  thumbnail: {
    cropId: string | null
    originalId: string | null
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
  assets: VideoWorkspaceVideoAssets
}

export type VideoFormAssets = VideoAssets<{
  id: string
  originalId?: string
  hashPromise: Promise<string>
  blob: Blob
  url?: string
  dimensions?: AssetDimensions
  cropData?: ImageCropData
}>

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
  triggerFormSubmit: () => void
  triggerReset: () => void
}
