import { promisify } from '@/utils/data'
import { readFromLocalStorage, writeToLocalStorage } from '@/utils/localStorage'
import { Member, Channel } from './useMember'

export const getMember = promisify(() => readFromLocalStorage<Member>('member') || null)

export const addMember = async (member: Member) => {
  writeToLocalStorage('member', { ...member, activeChannel: member.channels[0] })
  const newMember = await getMember()
  return newMember
}

export const addChannel = async (channel: Channel) => {
  const member = await getMember()
  const updatedMember = { ...member, channels: member?.channels.push(channel) }
  writeToLocalStorage('member', updatedMember)
  const newMember = await getMember()
  return newMember
}

export const setActiveChannel = async (channelId: string) => {
  const member = await getMember()
  const channel = member?.channels.find((channel) => channel.id === channelId)
  const updatedMember = { ...member, activeChannel: channel }
  writeToLocalStorage('member', updatedMember)
  const newMember = await getMember()
  return newMember
}

export const removeMember = () => {
  writeToLocalStorage('member', null)
}
