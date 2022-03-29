import React from 'react'

import { SvgActionNotifications } from '@/components/_icons'
import { useNotifications } from '@/providers/notifications'

import { StyledButton } from './NotificationsButton.styles'

export const NotificationsButton = () => {
  const { notifications } = useNotifications()
  const unreadNotifications = notifications.filter((n) => !n.read).length
  return <StyledButton variant="secondary" icon={<SvgActionNotifications />} badge={unreadNotifications} />
}
