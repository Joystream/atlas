import { createStore } from '@/utils/store'

export type RecipientType = 'ChannelRecipient' | 'MemberRecipient'

export type NotificationsStoreState = {
  // Lists of lasts seen notifications for the various type and channel ids
  lastSeenNotificationDates: { type: RecipientType; id: string; date: number }[]
}

export type NotificationsStoreActions = {
  setLastSeenNotificationDate: (type: RecipientType, id: string, date: Date) => void
}

export const useNotificationStore = createStore<NotificationsStoreState, NotificationsStoreActions>(
  {
    state: {
      lastSeenNotificationDates: [],
    },
    actionsFactory: (set) => ({
      setLastSeenNotificationDate: (type, id, date) => {
        set((state) => {
          state.lastSeenNotificationDates = [
            ...state.lastSeenNotificationDates.filter((record) => record.type !== type || record.id !== id),
            { id, type, date: date.getTime() },
          ]
        })
      },
    }),
  },
  {
    persist: {
      key: 'notifications',
      whitelist: ['lastSeenNotificationDates'],
      version: 0,
      migrate: (state) => {
        return {
          ...state,
        }
      },
    },
  }
)
