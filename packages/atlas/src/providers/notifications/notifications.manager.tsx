import React from 'react'

import { useRawNotifications } from '@/api/hooks'

export const NotificationsManager: React.FC = () => {
  // trigger notifications fetch
  useRawNotifications()
  return null
}
