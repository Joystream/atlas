import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  getMember as getMemberFn,
  setMember as setMemberFn,
  setActiveChannel as setActiveChannelFn,
  removeMember as removeMemberFn,
} from './utils'

export type Member = {
  id: string
  activeChannelId: string
}
export type MemberState = Member | null

type MemberContextValue = {
  memberState: MemberState
  fetchMember: () => Promise<void>
}

const MemberContext = React.createContext<undefined | MemberContextValue>(undefined)
MemberContext.displayName = 'MemberContext'

export const MemberProvider: React.FC = ({ children }) => {
  const [memberState, setMemberState] = useState<MemberState>(null)

  const fetchMember = useCallback(async () => {
    const member = await getMemberFn()
    setMemberState(member)
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

  const setMember = useCallback(
    async (memberData: Member) => {
      const member = await setMemberFn(memberData)
      fetchMember()
      return member
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
    setMember,
    setActiveChannel,
    removeMember,
  }
}
