import { createStore } from '@/utils/store'

type YppStoreState = {
  referrerId: string | null
  authState: string | null // 'state' param passed to Google auth URL
}

type YppStoreActions = {
  setReferrerId: (referrerId: string) => void
  setAuthState: (authState: string | null) => void
}

export const useYppStore = createStore<YppStoreState, YppStoreActions>(
  {
    state: {
      referrerId: null,
      authState: null,
    },
    actionsFactory: (set) => ({
      setReferrerId: (referrerId) => {
        set((state) => {
          state.referrerId = referrerId
        })
      },
      setAuthState: (authState) => {
        set((state) => {
          state.authState = authState
        })
      },
    }),
  },
  {
    persist: {
      key: 'ypp',
      whitelist: ['referrerId', 'authState'],
      version: 0,
      migrate: (oldState) => oldState,
    },
  }
)
