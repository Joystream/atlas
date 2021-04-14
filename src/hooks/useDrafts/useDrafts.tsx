import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  addDraft,
  clearDrafts,
  clearUnseenDrafts,
  getDraft,
  getDrafts,
  removeDraft,
  updateDraft,
  getUnseenDrafts,
  addUnseenDraft,
} from './utils'
import { Language, VideoCategory } from '@/api/queries'

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
  language?: Language['iso']
  categoryId?: VideoCategory['id']
} & CommonDraftProps

export type RawDraft = Omit<Draft, 'id' | 'updatedAt' | 'type'>

type DraftState = {
  videos: VideoDraft[]
}

export type UnseenDraft = {
  draftId: string
  channelId: string
}

type DraftsContextValue = {
  draftsState: DraftState
  fetchDrafts: () => Promise<void>
  unseenDrafts: UnseenDraft[]
  fetchUnseenDrafts: () => Promise<void>
}

const DraftsContext = React.createContext<undefined | DraftsContextValue>(undefined)
DraftsContext.displayName = 'DraftsContext'

export const DraftsProvider: React.FC = ({ children }) => {
  const [draftsState, setDraftsState] = useState<DraftState>({
    videos: [],
  })
  const [unseenDrafts, setUnseenDrafts] = useState<UnseenDraft[]>([])

  const fetchDrafts = useCallback(async () => {
    const currentDrafts = await getDrafts()
    const videos = currentDrafts.filter((draft): draft is VideoDraft => draft.type === 'video')

    setDraftsState({
      videos,
    })
  }, [setDraftsState])

  const fetchUnseenDrafts = useCallback(async () => {
    const unseenDrafts = await getUnseenDrafts()
    setUnseenDrafts(unseenDrafts)
  }, [setUnseenDrafts])

  useEffect(() => {
    fetchDrafts()
  }, [fetchDrafts])

  useEffect(() => {
    fetchUnseenDrafts()
  }, [fetchUnseenDrafts])

  return (
    <DraftsContext.Provider value={{ draftsState, fetchDrafts, unseenDrafts, fetchUnseenDrafts }}>
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
  const { draftsState, fetchDrafts, unseenDrafts, fetchUnseenDrafts } = useContextDrafts()

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
      await addUnseenDraft(newDraft.id, newDraft.channelId)
      fetchUnseenDrafts()
      fetchDrafts()
      return newDraft
    },
    [fetchDrafts, fetchUnseenDrafts, type]
  )

  const discardDraft = useCallback(
    async (draftIds: string | string[]) => {
      await removeDraft(draftIds)
      fetchUnseenDrafts()
      fetchDrafts()
    },
    [fetchDrafts, fetchUnseenDrafts]
  )

  const removeAllUnseenDrafts = useCallback(
    async (channelId?: string) => {
      await clearUnseenDrafts(channelId)
      fetchUnseenDrafts()
    },
    [fetchUnseenDrafts]
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
    unseenDrafts: unseenDrafts.filter((draft) => (channelId ? draft.channelId === channelId : true)),
    updateDraft: updateSingleDraft,
    addDraft: createSingleDraft,
    getDraft: getSingleDraft,
    removeDraft: discardDraft,
    removeAllDrafts: discardAllDrafts,
    removeAllUnseenDrafts,
  } as const
}
