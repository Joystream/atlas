import create from 'zustand'

import { Language, License, VideoCategory } from '@/api/queries'
import { createId } from '@/utils/createId'

export type CommonDraftProps = {
  id: string
  channelId: string
  updatedAt: string
}

export type Draft = VideoDraft

export type DraftType = 'video'

export type VideoDraft = {
  type: 'video'
  title?: string | null
  description?: string | null
  isPublic?: boolean | null
  publishedBeforeJoystream?: string | null
  hasMarketing?: boolean | null
  isExplicit?: boolean | null
  language?: Language['iso'] | null
  category?: VideoCategory['id'] | null
  licenseCode?: License['code'] | null
  licenseCustomText?: License['customText'] | null
  licenseAttribution?: License['attribution'] | null
} & CommonDraftProps

export type RawDraft = Omit<Draft, 'id' | 'updatedAt'>

export type UnseenDraft = {
  draftId: string
  channelId: string
}
// TODO: persistance and migration
// const DRAFTS_STORAGE_KEY = 'drafts'

interface DraftStore {
  //TODO: state here should probably be a map of channelIds so we get the right data when channel changes
  drafts: Draft[]
  unseenDrafts: UnseenDraft[]
  addDraft: (draft: RawDraft, explicitId?: string) => Draft
  updateDraft: (draftId: string, draftProps: RawDraft) => void
  getDraft: (draftId: string) => Draft | undefined
  removeDrafts: (draftIds: string[]) => void
  removeAllDrafts: () => void
  removeAllUnseenDrafts: () => void
}

export const useDraftStore = create<DraftStore>((set, get) => ({
  drafts: [],
  unseenDrafts: [],
  addDraft: (draft, explicitId) => {
    const id = explicitId ?? createId()
    const updatedAt = new Date().toISOString()
    const newDraft: Draft = { ...draft, updatedAt, id }
    set((state) => ({
      ...state,
      drafts: [newDraft, ...state.drafts],
      unseenDrafts: [{ draftId: newDraft.id, channelId: newDraft.channelId }, ...state.unseenDrafts],
    }))
    return newDraft
  },
  updateDraft: (draftId, draftProps) => {
    const updatedAt = new Date().toISOString()
    set((state) => ({
      ...state,
      drafts: state.drafts.map((draft) => {
        if (draft.id !== draftId) {
          return draft
        }
        return { ...draft, ...draftProps, updatedAt }
      }),
    }))
  },
  getDraft: (id) => get().drafts.find((draft) => draft.id === id),
  removeDrafts: (draftIds) => {
    set((state) => ({
      ...state,
      drafts: state.drafts.filter((draft) => !draftIds.includes(draft.id)),
      unseenDrafts: state.unseenDrafts.filter((draft) => !draftIds.includes(draft.draftId)),
    }))
  },
  removeAllDrafts: () => {
    set((state) => ({ ...state, drafts: [], unseenDrafts: [] }))
  },
  removeAllUnseenDrafts: () => {
    set((state) => ({ ...state, unseenDrafts: [] }))
  },
}))
