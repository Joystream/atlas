import { promisify } from '@/utils/data'
import { readFromLocalStorage, writeToLocalStorage } from '@/utils/localStorage'
import { Member } from './useMember'

export const getMember = promisify(() => readFromLocalStorage<Member>('member') || null)

export const setMember = async (member: Member) => {
  writeToLocalStorage('member', member)
  const newMember = await getMember()
  return newMember
}

export const setActiveChannel = async (channelId: string) => {
  const member = await getMember()
  if (!member?.id) {
    throw new Error('Member must be setted first.')
  }
  const updatedMember = { ...member, activeChannel: channelId }
  writeToLocalStorage('member', updatedMember)
  const newMember = await getMember()
  return newMember
}

export const removeMember = () => {
  writeToLocalStorage('member', null)
}
