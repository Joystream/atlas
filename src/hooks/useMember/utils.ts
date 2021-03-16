import { promisify } from '@/utils/data'
import { readFromLocalStorage, writeToLocalStorage } from '@/utils/localStorage'
import { ActiveMember } from './useMember'

export const getMember = promisify(() => readFromLocalStorage<ActiveMember>('activeMember') || null)

export const setMember = async (member: ActiveMember) => {
  writeToLocalStorage('activeMember', member)
  const newMember = await getMember()
  return newMember
}

export const setActiveChannel = async (channelId: string) => {
  const member = await getMember()
  if (!member) {
    return
  }
  const updatedMember = { ...member, activeChannelId: channelId }
  writeToLocalStorage('activeMember', updatedMember)
  const newMember = await getMember()
  return newMember
}

export const removeMember = () => {
  writeToLocalStorage('activeMember', null)
}
