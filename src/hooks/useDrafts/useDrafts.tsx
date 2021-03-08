import React, { useCallback, useContext, useEffect, useState } from 'react'
import { addDraft, clearDrafts, getDraft, getDrafts, removeDraft, updateDraft } from './utils'

export type CommonDraftProps = {
  id: string
  updatedAt: Date
}

export type Draft = VideoDraft

export type DraftType = 'video'

export type VideoDraft = {
  type: 'video'
  title?: string
  description?: string
  isPublic?: boolean
  publishedBeforeJoystream?: string
  hasMarketing?: boolean
  isExplicit?: boolean
} & CommonDraftProps

export type RawDraft = Omit<Draft, 'id' | 'updatedAt' | 'type'>

type DraftState = {
  videos: VideoDraft[]
}

type DraftsContextValue = {
  draftsState: DraftState
  fetchDrafts: () => Promise<void>
}

const DraftsContext = React.createContext<undefined | DraftsContextValue>(undefined)
DraftsContext.displayName = 'DraftsContext'

export const DraftsProvider: React.FC = ({ children }) => {
  const [draftsState, setDraftsState] = useState<DraftState>({
    videos: [],
  })

  const fetchDrafts = useCallback(async () => {
    const currentDrafts = await getDrafts()
    const videos = currentDrafts.filter((draft): draft is VideoDraft => draft.type === 'video')
    setDraftsState({
      videos,
    })
  }, [setDraftsState])

  useEffect(() => {
    fetchDrafts()
  }, [fetchDrafts])

  return <DraftsContext.Provider value={{ draftsState, fetchDrafts }}>{children}</DraftsContext.Provider>
}

export const useContextDrafts = () => {
  const ctx = useContext(DraftsContext)
  if (ctx === undefined) {
    throw new Error('useDrafts must be used within a DraftsProvider')
  }
  return ctx
}

export const useDrafts = (type: DraftType) => {
  const { draftsState, fetchDrafts } = useContextDrafts()

  const getSingleDraft = useCallback(async (draftId: string) => {
    const draft = await getDraft(draftId)
    return draft
  }, [])

  const updateSingleDraft = useCallback(
    async (draftId: string, draftProps: RawDraft) => {
      const updatedDraft = await updateDraft(draftId, draftProps)
      fetchDrafts()
      return updatedDraft
    },
    [fetchDrafts]
  )

  const createSingleDraft = useCallback(
    async (draft: RawDraft) => {
      const newDraft = await addDraft({ ...draft, type })
      fetchDrafts()
      return newDraft
    },
    [fetchDrafts, type]
  )

  const discardDraft = useCallback(
    async (draftId: string) => {
      await removeDraft(draftId)
      fetchDrafts()
    },
    [fetchDrafts]
  )

  const discardAllDrafts = useCallback(async () => {
    clearDrafts()
    fetchDrafts()
  }, [fetchDrafts])

  return {
    drafts: type === 'video' ? draftsState.videos : [],
    updateDraft: updateSingleDraft,
    addDraft: createSingleDraft,
    getDraft: getSingleDraft,
    removeDraft: discardDraft,
    removeAllDrafts: discardAllDrafts,
  } as const
}
