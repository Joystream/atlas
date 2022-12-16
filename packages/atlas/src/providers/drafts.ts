import { License, VideoCategory } from '@/api/queries/__generated__/baseTypes.generated'
import { CommonStore, createStore } from '@/store'
import { createId } from '@/utils/createId'
import { readFromLocalStorage } from '@/utils/localStorage'

export type CommonDraftProps = {
  id: string
  channelId: string
  updatedAt: string
  seen?: boolean
}

export type Draft = VideoDraft

export type VideoDraft = {
  type: 'video'
  title?: string | null
  description?: string | null
  isPublic?: boolean | null
  publishedBeforeJoystream?: string | null
  hasMarketing?: boolean | null
  isExplicit?: boolean | null
  language?: string | null
  category?: VideoCategory['id'] | null
  licenseCode?: License['code'] | null
  licenseCustomText?: License['customText'] | null
  licenseAttribution?: License['attribution'] | null
  enableComments?: boolean | null
  isIssuedAsNFT?: boolean
} & CommonDraftProps

export type RawDraft = Omit<Draft, 'id' | 'updatedAt'>

type DraftStoreState = {
  drafts: Draft[]
}
type DraftStoreActions = {
  addDraft: (draft: RawDraft, explicitId?: string) => Draft
  updateDraft: (draftId: string, draftProps: RawDraft) => void
  removeDrafts: (draftIds: string[]) => void
  removeAllDrafts: (channelId: string) => void
  markAllDraftsAsSeenForChannel: (channelId: string) => void
}

export const useDraftStore = createStore<DraftStoreState, DraftStoreActions>(
  {
    state: {
      drafts: [], // includes drafts for different channels
    },
    actionsFactory: (set) => ({
      addDraft: (draft, explicitId) => {
        const id = explicitId ?? createId()
        const updatedAt = new Date().toISOString()
        const newDraft: Draft = { ...draft, updatedAt, id, seen: false }
        set((draftState) => {
          draftState.drafts.unshift(newDraft)
        })
        return newDraft
      },
      updateDraft: (draftId, draftProps) => {
        const updatedAt = new Date().toISOString()
        set((draftState) => {
          const idx = draftState.drafts.findIndex((d) => d.id === draftId)
          if (idx >= 0) {
            draftState.drafts[idx] = { ...draftState.drafts[idx], ...draftProps, updatedAt }
          }
        })
      },
      removeDrafts: (draftIds) => {
        set((draftState) => {
          draftState.drafts = draftState.drafts.filter((draft) => !draftIds.includes(draft.id))
        })
      },
      removeAllDrafts: (channelId) => {
        set((draftState) => {
          draftState.drafts = draftState.drafts.filter((draft) => draft.channelId !== channelId)
        })
      },
      markAllDraftsAsSeenForChannel: (channelId) => {
        set((draftState) => {
          draftState.drafts = draftState.drafts.map((draft) => ({
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
      whitelist: ['drafts'],
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
            return unseenDrafts?.find((unseen) => unseen.draftId === draft.id)
              ? { ...draft, seen: false }
              : { ...draft, seen: true }
          })
          return {
            drafts: drafts,
          }
        }
      },
    },
  }
)

export const singleDraftSelector = (id: string) => (store: CommonStore<DraftStoreState, DraftStoreActions>) =>
  store.drafts.find((draft) => draft.id === id)
export const channelDraftsSelector = (channelId: string) => (store: CommonStore<DraftStoreState, DraftStoreActions>) =>
  store.drafts.filter((d) => d.channelId === channelId)
export const chanelUnseenDraftsSelector =
  (channelId: string) => (store: CommonStore<DraftStoreState, DraftStoreActions>) =>
    store.drafts.filter((d) => d.channelId === channelId && d.seen === false)
