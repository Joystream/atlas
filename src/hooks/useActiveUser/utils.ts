import { promisify } from '@/utils/data'
import { readFromLocalStorage, writeToLocalStorage } from '@/utils/localStorage'
import { ActiveUser } from './useActiveUser'

type Key = 'memberId' | 'channelId'

export const getActiveUser = promisify(() => readFromLocalStorage<ActiveUser>('activeUser') || null)

export const setActiveUser = async (activeUser: ActiveUser) => {
  writeToLocalStorage('activeUser', activeUser)
  return activeUser
}

export const setData = async (id: string, key: Key) => {
  const activeUser = await getActiveUser()
  if (!activeUser) {
    return
  }
  const updatedActiveUser = { ...activeUser, [key]: id }
  writeToLocalStorage('activeUser', updatedActiveUser)
  return updatedActiveUser
}

export const removeActiveUser = () => {
  writeToLocalStorage('activeUser', null)
}
