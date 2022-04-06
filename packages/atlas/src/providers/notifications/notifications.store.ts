import { createStore } from '@/store'

export type NotificationsStoreState = {
  // block number at which all notifications were last marked as read
  lastAllReadBlock: number

  // list of notification IDs that were already read
  readNotificationsIdsMap: Record<string, boolean>
}

export type NotificationsStoreActions = {
  markNotificationsAsRead: (id: string[] | string) => void
}

export const useNotificationStore = createStore<NotificationsStoreState, NotificationsStoreActions>(
  {
    state: {
      lastAllReadBlock: 0,
      readNotificationsIdsMap: {},
    },
    actionsFactory: (set) => ({
      markNotificationsAsRead: (id) => {
        const _id = Array.isArray(id) ? id : [id]

        set((state) => {
          _id.forEach((id) => {
            state.readNotificationsIdsMap[id] = true
          })
        })
      },
    }),
  },
  {
    persist: {
      key: 'notifications',
      whitelist: ['lastAllReadBlock', 'readNotificationsIdsMap'],
      version: 0,
      migrate: (state) => {
        return {
          ...state,
        }
      },
    },
  }
)
