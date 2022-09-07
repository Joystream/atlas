import { useState } from 'react'

import { NotificationRecord } from '@/providers/notifications/notifications.types'

export const useSelectedNotifications = () => {
  const [selectedNotifications, setSelectedNotifications] = useState<NotificationRecord[]>([])

  const setNotificationSelected = (notification: NotificationRecord, selected: boolean) => {
    setSelectedNotifications((prevState) => {
      if (selected) {
        return [...prevState, notification]
      }
      return prevState.filter((notif) => notification.id !== notif.id)
    })
  }

  const selectAllNotifications = (allNotifications: NotificationRecord[]) => {
    setSelectedNotifications(allNotifications)
  }

  const unselectAllNotifications = () => {
    setSelectedNotifications([])
  }

  return { selectedNotifications, setNotificationSelected, selectAllNotifications, unselectAllNotifications }
}
