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

export type VideoWorkspaceTab = {
  id: string
  isDraft?: boolean
  isNew?: boolean
}

export type VideoWorkspaceAssetsCache = Record<string, VideoWorkspaceAssets | null>
export type VideoWorkspaceTabCachedDirtyFormData = Record<string, Partial<VideoWorkspaceFormFields>>

export type ContextValue = {
  videoTab: VideoWorkspaceTab
  addVideoTab: (tab?: VideoWorkspaceTab, shouldSelect?: boolean) => void
  updateSelectedVideoTab: (tabUpdates: Partial<VideoWorkspaceTab>) => void
  selectedVideoTabCachedDirtyFormData: Partial<VideoWorkspaceFormFields> | undefined
  setSelectedVideoTabCachedDirtyFormData: (formData: Partial<VideoWorkspaceFormFields>) => void
  selectedVideoTabCachedAssets: VideoWorkspaceAssets | null
  setSelectedVideoTabCachedAssets: (assets: VideoWorkspaceAssets | null) => void
  videoWorkspaceState: VideoWorkspaceState
  setVideoWorkspaceState: (state: VideoWorkspaceState) => void
  anyVideoTabsCachedAssets: boolean
  hasVideoTabAnyCachedAssets: (tabIdx: number) => boolean
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
