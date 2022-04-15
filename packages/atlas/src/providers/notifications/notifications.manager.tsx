import React, { useEffect } from 'react'

import { useNotifications } from './notifications.hooks'

export const NotificationsManager: React.FC = () => {
  const { startPolling, stopPolling } = useNotifications()

  useEffect(() => {
    startPolling(10000)

    return stopPolling
  }, [startPolling, stopPolling])

  return null
}
