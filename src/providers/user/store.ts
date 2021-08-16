import { AccountId, ChannelId, MemberId } from '@/joystream-lib'
import { createStore } from '@/store'
import { readFromLocalStorage } from '@/utils/localStorage'

const LOCAL_STORAGE_KEY = 'activeUser'

export type ActiveUserState = {
  accountId: AccountId | null
  memberId: MemberId | null
  channelId: ChannelId | null
}

const EMPTY_STATE: ActiveUserState = {
  accountId: null,
  memberId: null,
  channelId: null,
}

const WHITELIST = ['accountId', 'memberId', 'channelId'] as (keyof ActiveUserState)[]

export type ActiveUserStoreActions = {
  resetActiveUser: () => void
  setActiveUser: (activeUserState: Partial<ActiveUserState>) => void
}

export const useActiveUserStore = createStore<ActiveUserState, ActiveUserStoreActions>(
  {
    state: EMPTY_STATE,
    actionsFactory: (set) => ({
      resetActiveUser: () => {
        set((state) => ({ ...state, ...EMPTY_STATE }))
      },
      setActiveUser: (activeUserState) => {
        set((state) => {
          state.accountId = activeUserState.accountId || state.accountId
          state.memberId = activeUserState.memberId || state.memberId
          state.channelId = activeUserState.channelId || state.channelId
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
