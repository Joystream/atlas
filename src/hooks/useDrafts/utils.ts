import { promisify } from '@/utils/data'
import { readFromLocalStorage, writeToLocalStorage } from '@/utils/localStorage'
import { Draft, RawDraft } from './useDrafts'

export const getDrafts = promisify(() => readFromLocalStorage<Draft[]>('drafts') || [])

export const getDraft = async (id: string) => {
  const currentDrafts = await getDrafts()
  return currentDrafts.find((d) => d.id === id) ?? null
}

export const addDraft = async (draftProps: Omit<Draft, 'updatedAt' | 'id' | 'seen'>) => {
  const currentDrafts = await getDrafts()
  const updatedAt = new Date().toISOString()
  const id = Math.random().toString(36).substr(2, 11)
  const newDraft = { ...draftProps, updatedAt, id, seen: false }
  const newDrafts = [newDraft, ...currentDrafts]
  writeToLocalStorage('drafts', newDrafts)
  return newDraft
}

export const updateDraft = async (draftId: string, draftProps: RawDraft, setUpdatedDate: boolean) => {
  const currentDrafts = await getDrafts()
  const updatedAt = new Date().toISOString()
  const newDrafts = currentDrafts.map((draft) =>
    draft.id === draftId ? { ...draft, ...draftProps, updatedAt: setUpdatedDate ? updatedAt : draft.updatedAt } : draft
  )
  writeToLocalStorage('drafts', newDrafts)
  return newDrafts.find((draft) => draft.id === draftId)
}

export const removeDraft = async (ids: string | string[]) => {
  const currentDrafts = await getDrafts()
  let newDrafts
  if (Array.isArray(ids)) {
    newDrafts = currentDrafts.filter((draft) => !ids.includes(draft.id))
  } else {
    newDrafts = currentDrafts.filter((draft) => draft.id !== ids)
  }
  writeToLocalStorage('drafts', newDrafts)
}

export const clearDrafts = async (channelId?: string) => {
  const currentDrafts = await getDrafts()
  if (channelId) {
    writeToLocalStorage('drafts', [...currentDrafts.filter((draft) => draft.channelId !== channelId)])
  } else {
    writeToLocalStorage('drafts', [])
  }
}
