import { useState } from 'react'

export const useSelectedNotifications = () => {
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])

  const setNotificationSelected = (id: string, selected: boolean) => {
    setSelectedNotifications((prevState) => {
      if (selected) {
        return [...prevState, id]
      }
      return prevState.filter((notification) => notification !== id)
    })
  }

  return { selectedNotifications, setNotificationSelected }
}
