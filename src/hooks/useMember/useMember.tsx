import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  getMember as getMemberFn,
  addMember as addMemberFn,
  setActiveChannel as setActiveChannelFn,
  removeMember as removeMemberFn,
  addChannel as addChannelFn,
} from './utils'

export type Member = {
  id: string
  handle: string
  avatarUrl: string
  channels: Channel[]
  activeChannel: Channel
}

export type Channel = {
  id: string
  handle: string
  avatarUrl: string
}

type MemberState = {
  member: Member | null
}

type MemberContextValue = {
  memberState: MemberState
  fetchMember: () => Promise<void>
}

const MemberContext = React.createContext<undefined | MemberContextValue>(undefined)
MemberContext.displayName = 'MemberContext'

export const MemberProvider: React.FC = ({ children }) => {
  const [memberState, setMemberState] = useState<MemberState>({
    member: null,
  })

  const fetchMember = useCallback(async () => {
    const member = await getMemberFn()
    setMemberState({ member })
  }, [setMemberState])

  useEffect(() => {
    fetchMember()
  }, [fetchMember])

  return <MemberContext.Provider value={{ memberState, fetchMember }}>{children}</MemberContext.Provider>
}

export const useContextMember = () => {
  const ctx = useContext(MemberContext)
  if (ctx === undefined) {
    throw new Error('useMember must be used within a MemberProvider')
  }
  return ctx
}

export const useMember = () => {
  const { memberState, fetchMember } = useContextMember()

  const addMember = useCallback(
    async (memberData: Member) => {
      const member = await addMemberFn(memberData)
      fetchMember()
      return member
    },
    [fetchMember]
  )

  const addChannel = useCallback(
    async (channelData: Channel) => {
      const updatedMember = await addChannelFn(channelData)
      fetchMember()
      return updatedMember
    },
    [fetchMember]
  )

  const setActiveChannel = useCallback(
    async (channelId: string) => {
      const updatedMember = await setActiveChannelFn(channelId)
      fetchMember()
      return updatedMember
    },
    [fetchMember]
  )

  const removeMember = useCallback(async () => {
    removeMemberFn()
    fetchMember()
  }, [fetchMember])

  return {
    member: memberState,
    addMember,
    addChannel,
    setActiveChannel,
    removeMember,
  }
}
