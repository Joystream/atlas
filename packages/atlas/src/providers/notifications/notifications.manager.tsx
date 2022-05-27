import { FC, useEffect } from 'react'

import { useNotifications } from './notifications.hooks'

export const NotificationsManager: FC = () => {
  const { startPolling, stopPolling } = useNotifications()

  useEffect(() => {
    startPolling(10000)

    return stopPolling
  }, [startPolling, stopPolling])

  return null
}
