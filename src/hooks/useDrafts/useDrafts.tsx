import React, { useCallback, useContext, useEffect, useState } from 'react'
import { addOrUpdateDraft, clearDrafts, getDraft, getDraftsWithType, removeDraft } from './utils'

type UseDraftOpts<T> = {
  state: T
  type: string
}

export type CommonDraftProps<T = unknown> = { id: string; updatedAt: string; type: string } & T

type ContextType = {
  setDraftsState: React.Dispatch<React.SetStateAction<CommonDraftProps[]>>
  draftsState: CommonDraftProps[]
}

const DraftsContext = React.createContext<undefined | ContextType>(undefined)
DraftsContext.displayName = 'DraftsContext'

export const DraftsProvider: React.FC = ({ children }) => {
  const [draftsState, setDraftsState] = useState<CommonDraftProps[]>([])
  return <DraftsContext.Provider value={{ setDraftsState, draftsState }}>{children}</DraftsContext.Provider>
}

export const useContextDrafts = () => {
  const ctx = useContext(DraftsContext)
  if (ctx === undefined) {
    throw new Error('useDrafts must be used within a DraftsProvider')
  }
  return ctx
}

export const useDrafts = <T,>({ state, type }: UseDraftOpts<T>) => {
  const { setDraftsState, draftsState } = useContextDrafts()

  const getInitialDrafts = useCallback(async () => {
    const currentDrafts = await getDraftsWithType<T>(type)
    setDraftsState(currentDrafts)
  }, [setDraftsState, type])

  const getSingleDraft = async (draftId: string) => {
    const singleDraft = await getDraft<T>(draftId)
    return singleDraft
  }

  useEffect(() => {
    getInitialDrafts()
  }, [getInitialDrafts])

  const createOrUpdateDraft = async (draftId: string) => {
    await addOrUpdateDraft<T>(draftId, type, { ...state })
    await getInitialDrafts()
  }

  const discardDraft = async (draftId: string) => {
    await removeDraft(draftId)
    await getInitialDrafts()
  }

  const discardAllDrafts = async () => {
    clearDrafts()
    await getInitialDrafts()
  }

  return {
    drafts: draftsState as CommonDraftProps<T>[],
    createOrUpdateDraft,
    getDraft: getSingleDraft,
    removeDraft: discardDraft,
    removeAllDrafts: discardAllDrafts,
  }
}
