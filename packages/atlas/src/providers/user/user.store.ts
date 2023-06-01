import { createStore } from '@/utils/store'

import { ActiveUserState } from './user.types'

export type UserStoreActions = {
  resetActiveUser: () => void
  setActiveUser: (activeUserChanges: Partial<ActiveUserState>) => void
  signOut: () => void
}

export const useUserStore = createStore<ActiveUserState, UserStoreActions>(
  {
    state: {
      accountId: null,
      memberId: null,
      channelId: null,
    },
    actionsFactory: (set) => ({
      resetActiveUser: () => {
        set((state) => {
          state.accountId = null
          state.memberId = null
          state.channelId = null
        })
      },
      setActiveUser: (activeUserChanges) => {
        set((state) => {
          state.accountId = activeUserChanges.accountId !== undefined ? activeUserChanges.accountId : state.accountId
          state.memberId = activeUserChanges.memberId !== undefined ? activeUserChanges.memberId : state.memberId
          state.channelId = activeUserChanges.channelId !== undefined ? activeUserChanges.channelId : state.channelId
        })
      },
      signOut: () => {
        set((state) => {
          state.accountId = null
          state.memberId = null
          state.channelId = null
        })
      },
    }),
  },
  {
    persist: {
      key: 'activeUser',
      version: 0,
      whitelist: ['accountId', 'memberId', 'channelId'],
      migrate: (oldState) => {
        return oldState
      },
    },
  }
)
