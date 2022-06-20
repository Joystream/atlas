import { FC, useEffect } from 'react'

import { NOTIFICATIONS_POLLING_INTERVAL } from '@/config/nft'

import { useNotifications } from './notifications.hooks'

export const NotificationsManager: FC = () => {
  const { startPolling, stopPolling } = useNotifications()

  useEffect(() => {
    startPolling(NOTIFICATIONS_POLLING_INTERVAL)

    return stopPolling
  }, [startPolling, stopPolling])

  return null
}
