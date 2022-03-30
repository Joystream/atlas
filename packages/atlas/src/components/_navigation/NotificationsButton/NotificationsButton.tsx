import React from 'react'

import { SvgActionNotifications } from '@/components/_icons'

import { StyledButton } from './NotificationsButton.styles'

export const NotificationsButton = () => {
  return <StyledButton variant="secondary" icon={<SvgActionNotifications />} badge="27" />
}
