import { createStore } from '@/utils/store'

export type NotificationsStoreState = {
  // block number of lastly seen (not read) notification
  lastSeenNotificationDate: number
}

export type NotificationsStoreActions = {
  setLastSeenNotificationDate: (date: Date) => void
}

export const useNotificationStore = createStore<NotificationsStoreState, NotificationsStoreActions>(
  {
    state: {
      lastSeenNotificationDate: 0,
    },
    actionsFactory: (set) => ({
      setLastSeenNotificationDate: (date) => {
        set((state) => {
          state.lastSeenNotificationDate = date.getTime()
        })
      },
    }),
  },
  {
    persist: {
      key: 'notifications',
      whitelist: ['lastSeenNotificationDate'],
      version: 0,
      migrate: (state) => {
        return {
          ...state,
        }
      },
    },
  }
)
