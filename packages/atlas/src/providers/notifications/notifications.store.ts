import { createStore } from '@/utils/store'

export type NotificationsStoreState = {
  // block number of lastly seen (not read) notification
  lastSeenNotificationBlock: number
}

export type NotificationsStoreActions = {
  setLastSeenNotificationBlock: (block: number) => void
}

export const useNotificationStore = createStore<NotificationsStoreState, NotificationsStoreActions>(
  {
    state: {
      lastSeenNotificationBlock: 0,
    },
    actionsFactory: (set) => ({
      setLastSeenNotificationBlock: (block) => {
        set((state) => {
          state.lastSeenNotificationBlock = block
        })
      },
    }),
  },
  {
    persist: {
      key: 'notifications',
      whitelist: ['lastSeenNotificationBlock'],
      version: 0,
      migrate: (state) => {
        return {
          ...state,
        }
      },
    },
  }
)
