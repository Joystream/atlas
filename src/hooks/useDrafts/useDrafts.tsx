import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  addDraft,
  clearDrafts,
  getDraft,
  getDrafts,
  removeDraft,
  updateDraft,
  getDraftsSeenStatus,
  addDraftSeenStatus,
  updateDraftSeenStatus,
} from './utils'

export type CommonDraftProps = {
  id: string
  channelId: string
  updatedAt: string
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
  seen?: boolean
} & CommonDraftProps

export type RawDraft = Omit<Draft, 'id' | 'updatedAt' | 'type'>

type DraftState = {
  videos: VideoDraft[]
}

export type DraftsSeenStatusState = { id: string; seen: boolean }[]

type DraftsContextValue = {
  draftsState: DraftState
  fetchDrafts: () => Promise<void>
  draftsSeenStatusState: DraftsSeenStatusState
  fetchSeenDraftsStatus: () => Promise<void>
}

const DraftsContext = React.createContext<undefined | DraftsContextValue>(undefined)
DraftsContext.displayName = 'DraftsContext'

export const DraftsProvider: React.FC = ({ children }) => {
  const [draftsState, setDraftsState] = useState<DraftState>({
    videos: [],
  })
  const [draftsSeenStatusState, setDraftsSeenStatusState] = useState<DraftsSeenStatusState>([])

  const fetchDrafts = useCallback(async () => {
    const currentDrafts = await getDrafts()
    const videos = currentDrafts.filter((draft): draft is VideoDraft => draft.type === 'video')

    setDraftsState({
      videos,
    })
  }, [setDraftsState])

  const fetchSeenDraftsStatus = useCallback(async () => {
    const fetchSeenDraftsStatus = await getDraftsSeenStatus()
    setDraftsSeenStatusState(fetchSeenDraftsStatus)
  }, [setDraftsSeenStatusState])

  useEffect(() => {
    fetchDrafts()
  }, [fetchDrafts])

  useEffect(() => {
    fetchSeenDraftsStatus()
  }, [fetchSeenDraftsStatus])

  return (
    <DraftsContext.Provider value={{ draftsState, fetchDrafts, draftsSeenStatusState, fetchSeenDraftsStatus }}>
      {children}
    </DraftsContext.Provider>
  )
}

export const useContextDrafts = () => {
  const ctx = useContext(DraftsContext)
  if (ctx === undefined) {
    throw new Error('useDrafts must be used within a DraftsProvider')
  }
  return ctx
}

export const useDrafts = (type: DraftType, channelId?: string) => {
  const { draftsState, fetchDrafts, draftsSeenStatusState, fetchSeenDraftsStatus } = useContextDrafts()

  const getSingleDraft = useCallback(async (draftId: string) => {
    const draft = await getDraft(draftId)
    return draft
  }, [])

  const updateSingleDraft = useCallback(
    async (draftId: string, draftProps: RawDraft, setUpdatedDate = true) => {
      const updatedDraft = await updateDraft(draftId, draftProps, setUpdatedDate)
      fetchDrafts()
      return updatedDraft
    },
    [fetchDrafts]
  )

  const updateDraftSeenStatusState = useCallback(
    async (draftId: string, isSeen: boolean) => {
      const updatedDraftSeenStatus = await updateDraftSeenStatus(draftId, isSeen)
      fetchSeenDraftsStatus()
      return updatedDraftSeenStatus
    },
    [fetchSeenDraftsStatus]
  )

  const createSingleDraft = useCallback(
    async (draft: RawDraft) => {
      const newDraft = await addDraft({ ...draft, type })
      await addDraftSeenStatus(newDraft.id)
      fetchDrafts()
      return newDraft
    },
    [fetchDrafts, type]
  )

  const discardDraft = useCallback(
    async (draftIds: string | string[]) => {
      await removeDraft(draftIds)
      fetchDrafts()
    },
    [fetchDrafts]
  )

  const discardAllDrafts = useCallback(
    async (channelId?: string) => {
      await clearDrafts(channelId)
      fetchDrafts()
    },
    [fetchDrafts]
  )

  return {
    drafts:
      type === 'video' ? draftsState.videos.filter((draft) => (channelId ? draft.channelId === channelId : true)) : [],
    draftsSeenStatusState,
    updateDraftSeenStatusState,
    updateDraft: updateSingleDraft,
    addDraft: createSingleDraft,
    getDraft: getSingleDraft,
    removeDraft: discardDraft,
    removeAllDrafts: discardAllDrafts,
  } as const
}
