import React, { useContext } from 'react'
import { useActiveUserStore } from './store'

type ActiveUserContextValue = ReturnType<typeof useActiveUserStore>
const ActiveUserContext = React.createContext<undefined | ActiveUserContextValue>(undefined)
ActiveUserContext.displayName = 'ActiveUserContext'

export const ActiveUserProvider: React.FC = ({ children }) => {
  const store = useActiveUserStore()
  return <ActiveUserContext.Provider value={{ ...store }}>{children}</ActiveUserContext.Provider>
}

const useActiveUserContext = () => {
  const ctx = useContext(ActiveUserContext)
  if (ctx === undefined) {
    throw new Error('useMember must be used within a ActiveUserProvider')
  }
  return ctx
}

export const useUser = () => {
  const {
    activeUserState: { accountId: activeAccountId, memberId: activeMemberId, channelId: activeChannelId },
    ...rest
  } = useActiveUserContext()
  return {
    activeAccountId,
    activeMemberId,
    activeChannelId,
    ...rest,
  }
}

export const useAuthorizedUser = () => {
  const { activeAccountId, activeMemberId, activeChannelId, ...rest } = useUser()
  if (!activeAccountId || !activeMemberId || !activeChannelId) {
    throw new Error('Trying to use authorized user without authorization')
  }

  return {
    activeAccountId,
    activeMemberId,
    activeChannelId,
    ...rest,
  }
}
