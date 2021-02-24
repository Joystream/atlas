import { promisify } from '@/utils/data'
import { readFromLocalStorage, writeToLocalStorage } from '@/utils/localStorage'

export const getDraft = async (id: string) => {
  const currentDrafts = await getDrafts()
  return currentDrafts.find((d) => d.id === id) ?? null
}

export const getDrafts = promisify(() => readFromLocalStorage<any[]>('drafts') || [])

export const addOrUpdateDraft = async (id: string, draftProps: any) => {
  const currentDrafts = await getDrafts()
  const timeStamp = new Date().toISOString()
  const newDrafts = [
    { ...draftProps, id, recentlyUpdatedAt: timeStamp },
    ...currentDrafts.filter((search) => search.id !== id),
  ]
  writeToLocalStorage('drafts', newDrafts)
}

export const removeDraft = async (id: string) => {
  const currentDrafts = await getDrafts()
  const newDrafts = [...currentDrafts.filter((search) => search.id !== id)]
  writeToLocalStorage('drafts', newDrafts)
}

export const clearDrafts = () => {
  writeToLocalStorage('drafts', [])
}
