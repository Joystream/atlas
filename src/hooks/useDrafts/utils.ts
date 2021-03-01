import { promisify } from '@/utils/data'
import { readFromLocalStorage, writeToLocalStorage } from '@/utils/localStorage'
import { Draft, RawDraft } from './useDrafts'

export const getDrafts = promisify(() => readFromLocalStorage<Draft[]>('drafts') || [])

export const getDraft = async (id: string) => {
  const currentDrafts = await getDrafts()
  return currentDrafts.find((d) => d.id === id) ?? null
}

export const addDraft = async (draftProps: Omit<Draft, 'updatedAt' | 'id'>) => {
  const currentDrafts = await getDrafts()
  const updatedAt = new Date().toISOString()
  const id = new Date().getTime().toString()
  const newDraft = { ...draftProps, updatedAt, id }
  const newDrafts = [newDraft, ...currentDrafts]
  writeToLocalStorage('drafts', newDrafts)
  return newDraft
}

export const updateDraft = async (draftId: string, draftProps: RawDraft) => {
  const currentDrafts = await getDrafts()
  const updatedAt = new Date().toISOString()
  const newDrafts = currentDrafts.map((draft) =>
    draft.id === draftId ? { ...draft, ...draftProps, updatedAt } : draft
  )
  writeToLocalStorage('drafts', newDrafts)
  return newDrafts.find((draft) => draft.id === draftId)
}

export const removeDraft = async (id: string) => {
  const currentDrafts = await getDrafts()
  const newDrafts = currentDrafts.filter((draft) => draft.id !== id)
  writeToLocalStorage('drafts', newDrafts)
}

export const clearDrafts = () => {
  writeToLocalStorage('drafts', [])
}
