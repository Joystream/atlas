import { useEffect, useState } from 'react'
import { addOrUpdateDraft, clearDrafts, draft, drafts, removeDraft } from './utils'

type CommonDraftProps = { id: string; recentlyUpdatedAt: string }

export const useDraft = <T extends object>(state: T) => {
  const [draftsState, setDraftsState] = useState<(T & CommonDraftProps)[]>([])

  const getInitialDrafts = async () => {
    const currentDrafts = await drafts()
    setDraftsState(currentDrafts)
  }

  const getSingleDraft = async (draftId: string) => {
    const singleDraft = await draft(draftId)
    return singleDraft
  }

  useEffect(() => {
    getInitialDrafts()
  }, [])

  const createAndSaveDraft = async (draftId: string) => {
    await addOrUpdateDraft(draftId, { ...state })
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
    drafts: draftsState,
    createAndSaveDraft,
    getSingleDraft,
    discardDraft,
    discardAllDrafts,
  }
}
