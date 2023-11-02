import { FC, useEffect } from 'react'

import { atlasConfig } from '@/config'

import { useNotifications } from './notifications.hooks'

export const NotificationsManager: FC = () => {
  const { fetchMore, unseenNotificationsCounts } = useNotifications()

  useEffect(() => {
    const id = setInterval(() => {
      unseenNotificationsCounts.fetchMore()
      fetchMore({
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!Object.keys(prev).length) {
            return fetchMoreResult
          }

          const prevNotifs = prev.notificationsConnection.edges
          const nextNotifs = fetchMoreResult.notificationsConnection.edges

          const prevFirstNotif = prevNotifs[0]?.node
          if (!prevFirstNotif) {
            return fetchMoreResult
          }

          if (prevFirstNotif.id === nextNotifs[0]?.node.id) {
            return prev
          }

          const indexMatch = nextNotifs.findIndex(({ node }) => node.id === prevFirstNotif.id)
          const numberOfNewNotifications = indexMatch === -1 ? nextNotifs.length : indexMatch
          const edges = [...nextNotifs.slice(0, numberOfNewNotifications), ...prevNotifs]

          return {
            ...prev,
            notificationsConnection: { ...prev.notificationsConnection, edges },
          }
        },
      })
    }, atlasConfig.features.notifications.pollingInterval)

    return () => {
      clearInterval(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchMore, unseenNotificationsCounts.fetchMore])

  return null
}
