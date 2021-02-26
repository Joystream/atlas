import React, { useCallback, useContext, useEffect, useState } from 'react'
import { addDraft, clearDrafts, getDraft, getDrafts, removeDraft, updateDraft } from './utils'

export type DraftType = 'video' | 'channel'

export type CommonDraftProps = {
  id: string
  updatedAt?: string
}

export type VideoDraft = {
  type: 'video'
  title?: string
  description?: string
  publicness?: 'public' | 'private'
  publishedBefore?: string
  marketing?: boolean
  contentRating?: 'all' | 'mature'
} & CommonDraftProps

export type ChannelDraft = {
  type: 'channel'
  title?: string
  description?: string
  publicness?: 'public' | 'private'
  language?: string
} & CommonDraftProps

export type Draft = VideoDraft | ChannelDraft

type DraftState = {
  video: VideoDraft[]
  channel: ChannelDraft[]
}

type ContextType = {
  setDraftsState: (value: React.SetStateAction<DraftState>) => void
  draftsState: DraftState
  getInitialDrafts: () => Promise<void>
}

const DraftsContext = React.createContext<undefined | ContextType>(undefined)
DraftsContext.displayName = 'DraftsContext'

export const DraftsProvider: React.FC = ({ children }) => {
  const [draftsState, setDraftsState] = useState<ContextType['draftsState']>({
    channel: [],
    video: [],
  })

  const getInitialDrafts = useCallback(async () => {
    try {
      const currentDrafts = await getDrafts()
      const video = currentDrafts.filter((draft): draft is VideoDraft => draft.type === 'video')
      const channel = currentDrafts.filter((draft): draft is ChannelDraft => draft.type === 'channel')
      setDraftsState({
        video,
        channel,
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }, [setDraftsState])

  useEffect(() => {
    getInitialDrafts()
  }, [getInitialDrafts])

  return (
    <DraftsContext.Provider value={{ setDraftsState, draftsState, getInitialDrafts }}>
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

export const useDrafts = <T extends DraftType>(type: T) => {
  const { draftsState, getInitialDrafts } = useContextDrafts()

  const getSingleDraft = async (draftId: string) => {
    const singleDraft = await getDraft(draftId)
    if (singleDraft?.type === type) {
      return singleDraft
    }
  }

  const updateSingleDraft = async (draftId: string, draftProps: Partial<Omit<Draft, 'id' | 'updatedAt'>>) => {
    await updateDraft(draftId, draftProps)
    getInitialDrafts()
  }

  const createSingleDraft = async (draft: Omit<Draft, 'updatedAt'>) => {
    const newDraft = await addDraft({ ...draft, type })
    await getInitialDrafts()
    return newDraft
  }

  const discardDraft = async (draftId: string) => {
    await removeDraft(draftId)
    getInitialDrafts()
  }

  const discardAllDrafts = async () => {
    clearDrafts()
    getInitialDrafts()
  }

  return {
    drafts: draftsState[type],
    updateDraft: updateSingleDraft,
    addDraft: createSingleDraft,
    getDraft: getSingleDraft,
    removeDraft: discardDraft,
    removeAllDrafts: discardAllDrafts,
  }
}
