import React, { useCallback, useContext, useEffect, useState } from 'react'
import { addDraft, clearDrafts, getDraft, getDrafts, removeDraft, updateDraft } from './utils'

export type CommonDraftProps = {
  id: string
  updatedAt?: string
}

export type DraftType = 'videos' | 'channels'

export type VideoDraft = {
  type: 'videos'
  title?: string
  description?: string
  publicness?: 'public' | 'private'
  publishedBefore?: string
  marketing?: boolean
  contentRating?: 'all' | 'mature'
} & CommonDraftProps

export type ChannelDraft = {
  type: 'channels'
  title?: string
  description?: string
  publicness?: 'public' | 'private'
  language?: string
} & CommonDraftProps

export type Draft = VideoDraft | ChannelDraft

type DraftState = {
  videos: VideoDraft[]
  channels: ChannelDraft[]
}

type ContextType = {
  draftsState: DraftState
  getInitialDrafts: () => Promise<void>
}

const DraftsContext = React.createContext<undefined | ContextType>(undefined)
DraftsContext.displayName = 'DraftsContext'

export const DraftsProvider: React.FC = ({ children }) => {
  const [draftsState, setDraftsState] = useState<ContextType['draftsState']>({
    channels: [],
    videos: [],
  })

  const getInitialDrafts = useCallback(async () => {
    try {
      const currentDrafts = await getDrafts()
      const videos = currentDrafts.filter((draft): draft is VideoDraft => draft.type === 'videos')
      const channels = currentDrafts.filter((draft): draft is ChannelDraft => draft.type === 'channels')
      setDraftsState({
        videos,
        channels,
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }, [setDraftsState])

  useEffect(() => {
    getInitialDrafts()
  }, [getInitialDrafts])

  return <DraftsContext.Provider value={{ draftsState, getInitialDrafts }}>{children}</DraftsContext.Provider>
}

type GetDraftType<T extends DraftType> = T extends 'videos' ? VideoDraft : ChannelDraft

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
    const draft = (await getDraft(draftId)) as GetDraftType<T>
    return draft
  }

  const updateSingleDraft = async (draftId: string, draftProps: Omit<Draft, 'id' | 'updatedAt' | 'type'>) => {
    const updatedDraft = await updateDraft(draftId, draftProps)
    getInitialDrafts()
    return updatedDraft as GetDraftType<T>
  }

  const createSingleDraft = async (draft: Omit<Draft, 'updatedAt' | 'id' | 'type'>) => {
    const newDraft = await addDraft({ ...draft, type })
    await getInitialDrafts()
    return newDraft as GetDraftType<T>
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
