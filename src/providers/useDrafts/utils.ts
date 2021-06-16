import { createId } from '@/utils/createId'
import { promisify } from '@/utils/data'
import { readFromLocalStorage, writeToLocalStorage } from '@/utils/localStorage'

import { Draft, UnseenDraft } from './useDrafts'

export const getDrafts = promisify(() => readFromLocalStorage<Draft[]>('drafts') || [])

export const getUnseenDrafts = promisify(() => readFromLocalStorage<UnseenDraft[]>('unseenDrafts') || [])

export const getDraft = async (id: string) => {
  const currentDrafts = await getDrafts()
  return currentDrafts.find((d) => d.id === id) ?? null
}

export const addDraft = async (draftProps: Omit<Draft, 'updatedAt' | 'id'>, explicitId?: string) => {
  const currentDrafts = await getDrafts()
  const updatedAt = new Date().toISOString()
  const id = explicitId ?? createId()
  const newDraft = { ...draftProps, updatedAt, id }
  const newDrafts = [newDraft, ...currentDrafts]
  writeToLocalStorage('drafts', newDrafts)
  return newDraft
}

export const updateDraft = async (draftId: string, draftProps: Omit<Draft, 'updatedAt' | 'id' | 'type'>) => {
  const currentDrafts = await getDrafts()
  const updatedAt = new Date().toISOString()
  const newDrafts = currentDrafts.map((draft) =>
    draft.id === draftId ? { ...draft, ...draftProps, updatedAt } : draft
  )
  writeToLocalStorage('drafts', newDrafts)
  return newDrafts.find((draft) => draft.id === draftId)
}

export const removeDraft = async (ids: string | string[]) => {
  const currentDrafts = await getDrafts()
  const currentUnseenDrafts = await getUnseenDrafts()
  let newDrafts, newUnseenDrafts
  if (Array.isArray(ids)) {
    newDrafts = currentDrafts.filter((draft) => !ids.includes(draft.id))
    newUnseenDrafts = currentUnseenDrafts.filter(({ draftId }) => !ids.includes(draftId))
  } else {
    newDrafts = currentDrafts.filter((draft) => draft.id !== ids)
    newUnseenDrafts = currentUnseenDrafts.filter(({ draftId }) => draftId !== ids)
  }
  writeToLocalStorage('drafts', newDrafts)
  writeToLocalStorage('unseenDrafts', newUnseenDrafts)
}

export const clearDrafts = async (channelId?: string) => {
  const currentDrafts = await getDrafts()
  if (channelId) {
    writeToLocalStorage('drafts', [...currentDrafts.filter((draft) => draft.channelId !== channelId)])
  } else {
    writeToLocalStorage('drafts', [])
  }
}

export const addUnseenDraft = async (draftId: string, channelId: string) => {
  const currentUnseenDrafts = await getUnseenDrafts()
  const newUnseenDrafts = [{ draftId, channelId }, ...currentUnseenDrafts]
  writeToLocalStorage('unseenDrafts', newUnseenDrafts)
  return newUnseenDrafts
}

export const clearUnseenDrafts = async (channelId?: string) => {
  const currentUnseenDrafts = await getUnseenDrafts()
  if (channelId) {
    writeToLocalStorage('unseenDrafts', [...currentUnseenDrafts.filter((draft) => draft.channelId !== channelId)])
  } else {
    writeToLocalStorage('unseenDrafts', [])
  }
}
