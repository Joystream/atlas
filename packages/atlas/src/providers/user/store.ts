import { createStore } from '@/store'
import { readFromLocalStorage } from '@/utils/localStorage'

const LOCAL_STORAGE_KEY = 'activeUser'

export type ActiveUserState = {
  accountId: string | null
  memberId: string | null
  channelId: string | null
}

const EMPTY_STATE: ActiveUserState = {
  accountId: null,
  memberId: null,
  channelId: null,
}

const WHITELIST = ['accountId', 'memberId', 'channelId'] as (keyof ActiveUserState)[]

export type ActiveUserStoreActions = {
  resetActiveUser: () => void
  setActiveUser: (activeUserChanges: Partial<ActiveUserState>) => void
}

export const useActiveUserStore = createStore<ActiveUserState, ActiveUserStoreActions>(
  {
    state: EMPTY_STATE,
    actionsFactory: (set) => ({
      resetActiveUser: () => {
        set((state) => ({ ...state, ...EMPTY_STATE }))
      },
      setActiveUser: (activeUserChanges) => {
        set((state) => {
          state.accountId = activeUserChanges.accountId !== undefined ? activeUserChanges.accountId : state.accountId
          state.memberId = activeUserChanges.memberId !== undefined ? activeUserChanges.memberId : state.memberId
          state.channelId = activeUserChanges.channelId !== undefined ? activeUserChanges.channelId : state.channelId
        })
      },
    }),
  },
  {
    persist: {
      key: LOCAL_STORAGE_KEY,
      version: 0,
      whitelist: WHITELIST,
      migrate: (oldState, oldVersion) => {
        // migrate store before zustand was added
        if (oldVersion === undefined) {
          const activeUser = readFromLocalStorage<ActiveUserState>(LOCAL_STORAGE_KEY)
          return activeUser
        }
      },
    },
  }
)
