import { FC, useEffect } from 'react'

import { atlasConfig } from '@/config'

import { useNotifications } from './notifications.hooks'

export const NotificationsManager: FC = () => {
  const { startPolling, stopPolling } = useNotifications()

  useEffect(() => {
    startPolling(atlasConfig.features.notifications.pollingInterval)

    return stopPolling
  }, [startPolling, stopPolling])

  return null
}
