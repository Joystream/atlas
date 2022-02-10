import { ImageInputMetadata, VideoInputMetadata } from '@/components/_inputs/MultiFileSelect'

export type VideoWorkspaceVideoAssets = {
  video: {
    id: string | null
  } & VideoInputMetadata
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
