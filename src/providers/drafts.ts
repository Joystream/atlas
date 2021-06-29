import { Language, License, VideoCategory } from '@/api/queries'
import { createStore } from '@/store'
import { createId } from '@/utils/createId'
import { readFromLocalStorage } from '@/utils/localStorage'

export type CommonDraftProps = {
  id: string
  channelId: string
  updatedAt: string
  seen?: boolean
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

type DraftStoreStateV1 = {
  allDrafts: Draft[]
}
type DraftStoreActions = {
  addDraft: (draft: RawDraft, explicitId?: string) => Draft
  updateDraft: (draftId: string, draftProps: RawDraft) => void
  getDraft: (draftId: string) => Draft | undefined
  getDraftsForChannel: (draftIds: string) => Draft[]
  getUnseenDraftsForChannel: (draftIds: string) => Draft[]
  markAllDraftsAsSeenForChannel: (channelId: string) => void
  removeDrafts: (draftIds: string[]) => void
  removeAllDrafts: (channelId: string) => void
}

export const useDraftStore = createStore<DraftStoreStateV1, DraftStoreActions>(
  {
    state: {
      allDrafts: [], // includes drafts for different channels
    },
    actionsFactory: (set, get) => ({
      addDraft: (draft, explicitId) => {
        const id = explicitId ?? createId()
        const updatedAt = new Date().toISOString()
        const newDraft: Draft = { ...draft, updatedAt, id, seen: false }
        set((draftState) => {
          draftState.allDrafts.unshift(newDraft)
        })
        return newDraft
      },
      updateDraft: (draftId, draftProps) => {
        const updatedAt = new Date().toISOString()
        set((draftState) => {
          const idx = draftState.allDrafts.findIndex((d) => d.id === draftId)
          if (idx >= 0) {
            draftState.allDrafts[idx] = { ...draftState.allDrafts[idx], ...draftProps, updatedAt }
          }
        })
      },
      getDraft: (id) => get().allDrafts.find((draft) => draft.id === id),
      getDraftsForChannel: (channelId) => get().allDrafts.filter((d) => d.channelId === channelId),
      getUnseenDraftsForChannel: (channelId) =>
        get().allDrafts.filter((d) => d.channelId === channelId && d.seen === false),
      removeDrafts: (draftIds) => {
        set((draftState) => {
          draftState.allDrafts = draftState.allDrafts.filter((draft) => !draftIds.includes(draft.id))
        })
      },
      removeAllDrafts: (channelId) => {
        set((draftState) => {
          draftState.allDrafts = draftState.allDrafts.filter((draft) => draft.channelId !== channelId)
        })
      },
      markAllDraftsAsSeenForChannel: (channelId) => {
        set((draftState) => {
          draftState.allDrafts = draftState.allDrafts.map((draft) => ({
            ...draft,
            seen: draft.channelId === channelId ? true : draft.seen,
          }))
        })
      },
    }),
  },
  {
    persist: {
      key: 'drafts',
      whitelist: ['allDrafts'],
      version: 1,
      migrate: (oldState, oldVersion, storageValue) => {
        // migrate store before zustand was added
        if (oldVersion === undefined) {
          const unseenDrafts = readFromLocalStorage<
            Array<{
              draftId: string
              channelId: string
            }>
          >('unseenDrafts')
          const drafts = [...(storageValue as Array<Draft>)].map((draft) => {
            unseenDrafts?.find((unseen) => unseen.draftId === draft.id)
              ? { ...draft, seen: false }
              : { ...draft, seen: true }
          })
          return {
            allDrafts: drafts,
          }
        }
      },
    },
  }
)
