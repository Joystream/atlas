import { createStore } from '@/store'

export type NotificationsStoreState = {
  // block number at which all notifications were last marked as read
  lastAllReadBlock: number

  // list of notification IDs that were already read
  readNotificationsIdsMap: Record<string, boolean>
}

export type NotificationsStoreActions = {
  markNotificationsAsRead: (ids: { id: string }[] | { id: string }, asRead?: boolean) => void
  markNotificationsAsUnread: (ids: { id: string }[] | { id: string }) => void
}

export const useNotificationStore = createStore<NotificationsStoreState, NotificationsStoreActions>(
  {
    state: {
      lastAllReadBlock: 0,
      readNotificationsIdsMap: {},
    },
    actionsFactory: (set) => {
      const markNotificationsAsRead: NotificationsStoreActions['markNotificationsAsRead'] = (ids, asRead = true) => {
        const _ids = Array.isArray(ids) ? ids : [ids]

        set((state) => {
          _ids.forEach(({ id }) => {
            state.readNotificationsIdsMap[id] = asRead
          })
        })
      }
      const markNotificationsAsUnread: NotificationsStoreActions['markNotificationsAsUnread'] = (ids) =>
        markNotificationsAsRead(ids, false)

      return { markNotificationsAsUnread, markNotificationsAsRead }
    },
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
