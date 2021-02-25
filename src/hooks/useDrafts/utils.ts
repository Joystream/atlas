import { promisify } from '@/utils/data'
import { readFromLocalStorage, writeToLocalStorage } from '@/utils/localStorage'
import { CommonDraftProps } from './useDrafts'

export const getDrafts = <T>() => promisify(() => readFromLocalStorage<CommonDraftProps<T>[]>('drafts') || [])()

export const getDraftsWithType = async <T>(type: string) => {
  const currentDrafts = await getDrafts<T>()
  return currentDrafts.filter((draft) => draft.type === type)
}

export const getDraft = async <T>(id: string) => {
  const currentDrafts = await getDrafts<T>()
  return currentDrafts.find((d) => d.id === id) ?? null
}

export const addOrUpdateDraft = async <T>(id: string, type: string, draftProps: T) => {
  const currentDrafts = await getDrafts<T>()
  const updatedAt = new Date().toISOString()
  const isDraftAlreadyExist = currentDrafts.some((draft) => draft.id === id)

  let newDrafts: CommonDraftProps<T>[] = []

  if (isDraftAlreadyExist) {
    newDrafts = currentDrafts.map((draft) => (draft.id === id ? { ...draft, ...draftProps, id, updatedAt } : draft))
  } else {
    newDrafts = [{ ...draftProps, id, updatedAt, type }, ...currentDrafts]
  }
  writeToLocalStorage('drafts', newDrafts)
}

export const removeDraft = async (id: string) => {
  const currentDrafts = await getDrafts()
  const newDrafts = [...currentDrafts.filter((draft) => draft.id !== id)]
  writeToLocalStorage('drafts', newDrafts)
}

export const clearDrafts = () => {
  writeToLocalStorage('drafts', [])
}
