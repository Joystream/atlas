import { createStore } from '@/utils/store'

type AdminState = {
  wasKilledLastTime: boolean
}

type AdminActions = {
  setWasKilledLastTime: (killed: boolean) => void
}

const INITIAL_STATE = {
  wasKilledLastTime: false,
}

export const useAdminStore = createStore<AdminState, AdminActions>(
  {
    state: INITIAL_STATE,
    actionsFactory: (set) => ({
      setWasKilledLastTime: (killed) => {
        set((state) => {
          state.wasKilledLastTime = killed
        })
      },
    }),
  },
  {
    persist: {
      key: 'admin',
      version: 0,
      whitelist: ['wasKilledLastTime'],
      migrate: () => null,
    },
  }
)
