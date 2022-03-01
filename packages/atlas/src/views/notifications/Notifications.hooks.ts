import { useState } from 'react'

export const useSelectedNotifications = () => {
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])

  const toggleSelected = (id: string) => {
    setSelectedNotifications((prevState) => {
      if (!prevState.includes(id)) {
        return [...prevState, id]
      }
      return prevState.filter((notification) => notification !== id)
    })
  }

  return { selectedNotifications, toggleSelected }
}
