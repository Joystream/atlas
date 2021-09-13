import { ImageInputMetadata, VideoInputMetadata } from '@/shared/components/MultiFileSelect'

export type EditVideoAssets = {
  video: {
    contentId: string | null
  } & VideoInputMetadata
  thumbnail: {
    cropContentId: string | null
    originalContentId: string | null
  } & ImageInputMetadata
}

export type EditVideoSheetTab = {
  id: string
  isDraft?: boolean
  isNew?: boolean
}

export type EditVideoAssetsCache = Record<string, EditVideoAssets | null>
export type EditVideoTabCachedDirtyFormData = Record<string, Partial<EditVideoFormFields>>

export type ContextValue = {
  videoTabs: EditVideoSheetTab[]
  addVideoTab: (tab?: EditVideoSheetTab, shouldSelect?: boolean) => void
  removeVideoTab: (tabIdx: number) => void
  updateSelectedVideoTab: (tabUpdates: Partial<EditVideoSheetTab>) => void
  selectedVideoTabIdx: number
  setSelectedVideoTabIdx: (tabIdx: number) => void
  selectedVideoTabCachedDirtyFormData: Partial<EditVideoFormFields> | undefined
  setSelectedVideoTabCachedDirtyFormData: (formData: Partial<EditVideoFormFields>) => void
  selectedVideoTabCachedAssets: EditVideoAssets | null
  setSelectedVideoTabCachedAssets: (assets: EditVideoAssets | null) => void
  sheetState: EditVideoSheetState
  setSheetState: (state: EditVideoSheetState) => void
  anyVideoTabsCachedAssets: boolean
  hasVideoTabAnyCachedAssets: (tabIdx: number) => boolean
}

export type EditVideoFormFields = {
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
  assets: EditVideoAssets
}

export type EditVideoSheetState = 'closed' | 'open' | 'minimized'
