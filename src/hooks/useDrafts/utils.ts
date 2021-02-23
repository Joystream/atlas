import { promisify } from '@/utils/data'
import { readFromLocalStorage, writeToLocalStorage } from '@/utils/localStorage'

export const draft = async (id: string) => {
  const currentDrafts = await drafts()
  return currentDrafts.find((d) => d.id === id) ?? null
}

export const drafts = promisify(() => readFromLocalStorage<any[]>('drafts') || [])

export const addOrUpdateDraft = async (id: string, draftProps: any) => {
  const currentDrafts = await drafts()
  const timeStamp = new Date().toISOString()
  const newDrafts = [
    { ...draftProps, id, recentlyUpdatedAt: timeStamp },
    ...currentDrafts.filter((search) => search.id !== id),
  ]
  writeToLocalStorage('drafts', newDrafts)
}

export const removeDraft = async (id: string) => {
  const currentDrafts = await drafts()
  const newDrafts = [...currentDrafts.filter((search) => search.id !== id)]
  writeToLocalStorage('drafts', newDrafts)
}

export const clearDrafts = () => {
  writeToLocalStorage('drafts', [])
}
