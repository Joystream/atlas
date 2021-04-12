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
type ActiveUserContextValue = {
  activeUser: ActiveUser
  fetchActiveUser: () => Promise<void>
  loading: boolean
}

const ActiveUserContext = React.createContext<undefined | ActiveUserContextValue>(undefined)
ActiveUserContext.displayName = 'ActiveUserContext'

export const ActiveUserProvider: React.FC = ({ children }) => {
  const [activeUser, setActiveUser] = useState<ActiveUser>({
    channelId: null,
    accountId: null,
    memberId: null,
  })
  const [loading, setLoading] = useState(true)

  const fetchActiveUser = useCallback(async () => {
    const activeUser = await getActiveUser()
    setActiveUser({ ...activeUser })
    setLoading(false)
  }, [setActiveUser])

  useEffect(() => {
    fetchActiveUser()
  }, [fetchActiveUser])

  return (
    <ActiveUserContext.Provider value={{ activeUser: activeUser, fetchActiveUser, loading }}>
      {children}
    </ActiveUserContext.Provider>
  )
}

export const useContextActiveUser = () => {
  const ctx = useContext(ActiveUserContext)
  if (ctx === undefined) {
    throw new Error('useMember must be used within a ActiveUserProvider')
  }
  return ctx
}

export const useActiveUser = () => {
  const { activeUser, fetchActiveUser, loading } = useContextActiveUser()

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
    activeUser,
    setActiveUser,
    setActiveMember,
    setActiveChannel,
    removeActiveUser,
    loading,
  }
}
