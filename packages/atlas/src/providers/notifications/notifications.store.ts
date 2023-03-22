import { createStore } from '@/utils/store'

export type NotificationsStoreState = {
  // block number of lastly seen (not read) notification
  lastSeenNotificationBlock: number

  // list of notification IDs that were already read
  readNotificationsIdsMap: Record<string, boolean>
}

export type NotificationsStoreActions = {
  markNotificationsAsRead: (ids: { id: string }[] | { id: string }, asRead?: boolean) => void
  markNotificationsAsUnread: (ids: { id: string }[] | { id: string }) => void

  setLastSeenNotificationBlock: (block: number) => void
}

export const useNotificationStore = createStore<NotificationsStoreState, NotificationsStoreActions>(
  {
    state: {
      lastSeenNotificationBlock: 0,
      readNotificationsIdsMap: {},
    },
    actionsFactory: (set) => ({
      markNotificationsAsRead: (ids) => {
        const _ids = Array.isArray(ids) ? ids : [ids]

        set((state) => {
          _ids.forEach(({ id }) => {
            state.readNotificationsIdsMap[id] = true
          })
        })
      },
      markNotificationsAsUnread: (ids) => {
        const _ids = Array.isArray(ids) ? ids : [ids]

        set((state) => {
          _ids.forEach(({ id }) => {
            state.readNotificationsIdsMap[id] = false
          })
        })
      },
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
      whitelist: ['lastSeenNotificationBlock', 'readNotificationsIdsMap'],
      version: 0,
      migrate: (state) => {
        return {
          ...state,
        }
      },
    },
  }
)
