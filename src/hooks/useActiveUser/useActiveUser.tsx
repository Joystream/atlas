import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  getActiveUser,
  setActiveUser as setActiveUserFn,
  setData,
  removeActiveUser as removeActiveUserFn,
} from './utils'
import { AccountId, ChannelId, MemberId } from '@/joystream-lib'

export type ActiveUser = {
  accountId: AccountId | null
  memberId: MemberId | null
  channelId: ChannelId | null
}
export type ActiveUserState = ActiveUser | null

type ActiveUserContextValue = {
  activeUserState: ActiveUserState
  fetchActiveUser: () => Promise<void>
}

const ActiveUserContext = React.createContext<undefined | ActiveUserContextValue>(undefined)
ActiveUserContext.displayName = 'ActiveUserContext'

export const ActiveUserProvider: React.FC = ({ children }) => {
  const [activeUserState, setActiveUserState] = useState<ActiveUserState>(null)

  const fetchActiveUser = useCallback(async () => {
    const activeUser = await getActiveUser()
    setActiveUserState(activeUser)
  }, [setActiveUserState])

  useEffect(() => {
    fetchActiveUser()
  }, [fetchActiveUser])

  return (
    <ActiveUserContext.Provider value={{ activeUserState, fetchActiveUser }}>{children}</ActiveUserContext.Provider>
  )
}

export const useContextActiveUser = () => {
  const ctx = useContext(ActiveUserContext)
  if (ctx === undefined) {
    throw new Error('useMember must be used within a MemberProvider')
  }
  return ctx
}

export const useActiveUser = () => {
  const { activeUserState, fetchActiveUser } = useContextActiveUser()

  const setActiveUser = useCallback(
    async (userData: ActiveUser) => {
      const user = await setActiveUserFn(userData)
      fetchActiveUser()
      return user
    },
    [fetchActiveUser]
  )

  const setActiveMember = useCallback(
    async (memberId: string) => {
      const activeUser = await setData(memberId, 'memberId')
      fetchActiveUser()
      return activeUser
    },
    [fetchActiveUser]
  )

  const setActiveChannel = useCallback(
    async (channelId: string) => {
      const activeUser = await setData(channelId, 'channelId')
      fetchActiveUser()
      return activeUser
    },
    [fetchActiveUser]
  )

  const removeActiveUser = useCallback(async () => {
    removeActiveUserFn()
    fetchActiveUser()
  }, [fetchActiveUser])

  return {
    activeUser: activeUserState,
    setActiveUser,
    setActiveMember,
    setActiveChannel,
    removeActiveUser,
  }
}
