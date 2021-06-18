import { InputFilesState } from '@/shared/components'

export type EditVideoSheetTab = {
  id: string
  isDraft?: boolean
  isNew?: boolean
}

export type EditVideoAssetsCache = Record<string, InputFilesState>
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
  selectedVideoTabCachedAssets: InputFilesState
  setSelectedVideoTabCachedAssets: (files: InputFilesState) => void
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
  isExplicit: boolean | null
  publishedBeforeJoystream: Date | null
  assets: InputFilesState
}

export type EditVideoSheetState = 'closed' | 'open' | 'minimized'
