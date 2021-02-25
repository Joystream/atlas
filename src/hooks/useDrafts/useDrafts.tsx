import { useEffect, useState } from 'react'
import { addOrUpdateDraft, clearDrafts, getDraft, getDrafts, removeDraft } from './utils'

type CommonDraftProps = { id: string; recentlyUpdatedAt: string }

export const useDrafts = <T extends object>(state: T) => {
  const [draftsState, setDraftsState] = useState<(T & CommonDraftProps)[]>([])

  const getInitialDrafts = async () => {
    const currentDrafts = await getDrafts()
    setDraftsState(currentDrafts)
  }

  const getSingleDraft = async (draftId: string) => {
    const singleDraft = await getDraft(draftId)
    return singleDraft
  }

  useEffect(() => {
    getInitialDrafts()
  }, [])

  const createOrUpdateDraft = async (draftId: string) => {
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
    createOrUpdateDraft,
    getDraft: getSingleDraft,
    removeDraft: discardDraft,
    removeAllDrafts: discardAllDrafts,
  }
}
