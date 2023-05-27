import { createStore } from '@/utils/store'

import { ActiveUserState } from './user.types'

export type UserStoreState = ActiveUserState & {
  userId: string | null
  signInModalOpen: boolean
}

export type UserStoreActions = {
  resetActiveUser: () => void
  setActiveUser: (activeUserChanges: Partial<ActiveUserState>) => void
  signOut: () => void
  setUserId: (userId: string | null) => void
  setSignInModalOpen: (isOpen: boolean) => void
}

export const useUserStore = createStore<UserStoreState, UserStoreActions>(
  {
    state: {
      accountId: null,
      memberId: null,
      channelId: null,

      userId: null,
      signInModalOpen: false,
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

      setUserId: (userId) => {
        set((state) => {
          state.userId = userId
        })
      },
      setSignInModalOpen: (isOpen) => {
        set((state) => {
          state.signInModalOpen = isOpen
        })
      },
    }),
  },
  {
    persist: {
      key: 'activeUser',
      version: 0,
      whitelist: ['accountId', 'memberId', 'channelId', 'userId'],
      migrate: (oldState) => {
        return oldState
      },
    },
  }
)
