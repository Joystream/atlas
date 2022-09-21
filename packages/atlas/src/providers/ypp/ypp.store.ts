import { createStore } from '@/utils/store'

type YppStoreState = {
  referrerId: string | null
}

type YppStoreActions = {
  setReferrerId: (referrerId: string) => void
}

export const useYppStore = createStore<YppStoreState, YppStoreActions>(
  {
    state: {
      referrerId: null,
    },
    actionsFactory: (set) => ({
      setReferrerId: (referrerId) => {
        set((state) => {
          state.referrerId = referrerId
        })
      },
    }),
  },
  { persist: { key: 'ypp', whitelist: ['referrerId'], version: 0, migrate: (oldState) => oldState } }
)
