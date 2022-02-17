import { UseFormReset } from 'react-hook-form'

import { ImageInputMetadata, MediaInputMetadata } from '@/components/_inputs/MultiFileSelect'
import { VideoAssets, VideoInputMetadata } from '@/joystream-lib'
import { AssetDimensions, ImageCropData } from '@/types/cropper'

export type VideoWorkspaceVideoAssets = {
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
  isPublic: boolean
  isExplicit: boolean
  publishedBeforeJoystream: Date | null
  assets: VideoWorkspaceVideoAssets
}

export type VideoFormData = {
  metadata: VideoInputMetadata
  assets: VideoAssets<{
    id: string
    originalId?: string
    hashPromise: Promise<string>
    blob: Blob
    url?: string
    dimensions?: AssetDimensions
    cropData?: ImageCropData
  }>
}

export type VideoWorkspaceFormStatus = {
  isValid: boolean
  isDirty: boolean
  hasUnsavedAssets?: boolean
  triggerFormSubmit: () => void
  resetForm: UseFormReset<VideoWorkspaceVideoFormFields>
}
