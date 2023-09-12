import { FC, useEffect } from 'react'

import { atlasConfig } from '@/config'

import { useNotifications } from './notifications.hooks'

export const NotificationsManager: FC = () => {
  const { fetchMore } = useNotifications()

  useEffect(() => {
    const id = setInterval(() => {
      fetchMore({
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!Object.keys(prev).length) {
            return fetchMoreResult
          }

          const prevNotifs = prev.notificationInAppDeliveriesConnection.edges
          const nextNotifs = fetchMoreResult.notificationInAppDeliveriesConnection.edges

          const prevFirstNotif = prevNotifs[0]?.node.notification
          if (!prevFirstNotif) {
            return fetchMoreResult
          }

          if (prevFirstNotif.id === nextNotifs[0]?.node.notification.id) {
            return prev
          }

          const indexMatch = nextNotifs.findIndex(({ node }) => node.notification.id === prevFirstNotif.id)
          const numberOfNewNotifications = indexMatch === -1 ? nextNotifs.length : indexMatch
          const edges = [...nextNotifs.slice(0, numberOfNewNotifications), ...prevNotifs]

          return {
            ...prev,
            notificationsConnection: { ...prev.notificationInAppDeliveriesConnection, edges },
          }
        },
      })
    }, atlasConfig.features.notifications.pollingInterval)

    return () => {
      clearInterval(id)
    }
  }, [fetchMore])

  return null
}
