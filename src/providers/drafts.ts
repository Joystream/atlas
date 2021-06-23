import { Language, License, VideoCategory } from '@/api/queries'
import { createStore } from '@/store'
import { createId } from '@/utils/createId'
import { readFromLocalStorage } from '@/utils/localStorage'

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

interface DraftStoreState {
  allDrafts: Draft[]
  allUnseenDrafts: UnseenDraft[]
}

interface DraftStoreActions {
  addDraft: (draft: RawDraft, explicitId?: string) => Draft
  updateDraft: (draftId: string, draftProps: RawDraft) => void
  getDraft: (draftId: string) => Draft | undefined
  getDraftsForChannel: (draftIds: string) => Draft[]
  getUnseenDraftsForChannel: (draftIds: string) => UnseenDraft[]
  removeDrafts: (draftIds: string[]) => void
  removeAllDrafts: (channelId: string) => void
  removeAllUnseenDrafts: (channelId: string) => void
}

export const useDraftStore = createStore<DraftStoreState, DraftStoreActions>(
  {
    state: {
      allDrafts: [], // includes drafts for different channels
      allUnseenDrafts: [], // includes unseenDrafts for different channels
    },
    actionsFactory: (set, get) => ({
      addDraft: (draft, explicitId) => {
        const id = explicitId ?? createId()
        const updatedAt = new Date().toISOString()
        const newDraft: Draft = { ...draft, updatedAt, id }
        set((draft) => {
          draft.allDrafts = [newDraft, ...draft.allDrafts]
          draft.allUnseenDrafts = [{ draftId: newDraft.id, channelId: newDraft.channelId }, ...draft.allUnseenDrafts]
        })
        return newDraft
      },
      updateDraft: (draftId, draftProps) => {
        const updatedAt = new Date().toISOString()
        set((draft) => {
          const idx = draft.allDrafts.findIndex((d) => d.id === draftId)
          if (idx >= 0) {
            draft.allDrafts[idx] = { ...draft.allDrafts[idx], ...draftProps, updatedAt }
          }
        })
      },
      getDraft: (id) => get().allDrafts.find((draft) => draft.id === id),
      getDraftsForChannel: (channelId) => get().allDrafts.filter((d) => d.channelId === channelId),
      getUnseenDraftsForChannel: (channelId) => get().allUnseenDrafts.filter((d) => d.channelId === channelId),
      removeDrafts: (draftIds) => {
        set((draft) => {
          draft.allDrafts = draft.allDrafts.filter((draft) => !draftIds.includes(draft.id))
          draft.allUnseenDrafts = draft.allUnseenDrafts.filter((draft) => !draftIds.includes(draft.draftId))
        })
      },
      removeAllDrafts: (channelId) => {
        set((draft) => {
          draft.allDrafts = draft.allDrafts.filter((draft) => draft.channelId !== channelId)
          draft.allUnseenDrafts = draft.allUnseenDrafts.filter((draft) => draft.channelId !== channelId)
        })
      },
      removeAllUnseenDrafts: (channelId) => {
        set((draft) => {
          draft.allUnseenDrafts = draft.allUnseenDrafts.filter((draft) => draft.channelId !== channelId)
        })
      },
    }),
  },
  {
    persist: {
      key: 'drafts',
      whitelist: ['allDrafts', 'allUnseenDrafts'],
      version: 1,
      migrate: (oldState, oldVersion, storageValue) => {
        // migrate store before zustand was added
        if (oldVersion === undefined) {
          return {
            allDrafts: [...storageValue],
            allUnseenDrafts: readFromLocalStorage<UnseenDraft[]>('unseenDrafts') ?? [],
          }
        }
      },
    },
  }
)
