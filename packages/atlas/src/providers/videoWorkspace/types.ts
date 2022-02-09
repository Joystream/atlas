import { ImageInputMetadata, VideoInputMetadata } from '@/components/_inputs/MultiFileSelect'

export type VideoWorkspaceAssets = {
  video: {
    contentId: string | null
  } & VideoInputMetadata
  thumbnail: {
    cropContentId: string | null
    originalContentId: string | null
  } & ImageInputMetadata
}

export type VideoWorkspace = {
  id: string
  isDraft?: boolean
  isNew?: boolean
}

export type VideoWorkspaceAssetsCache = VideoWorkspaceAssets | null
export type VideoWorkspaceCachedDirtyFormData = Partial<VideoWorkspaceFormFields>

export type ContextValue = {
  editedVideoInfo: VideoWorkspace
  setEditedVideo: (video?: VideoWorkspace) => void
  videoWorkspaceState: VideoWorkspaceState
  setVideoWorkspaceState: (state: VideoWorkspaceState) => void
  videoCachedAssets: VideoWorkspaceAssets | null
  setVideoCachedAssets: (assets: VideoWorkspaceAssets | null) => void
}

export type VideoWorkspaceFormFields = {
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
  assets: VideoWorkspaceAssets
}

export type VideoWorkspaceState = 'closed' | 'open' | 'unset'
