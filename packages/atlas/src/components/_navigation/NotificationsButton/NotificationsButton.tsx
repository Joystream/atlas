import { SvgActionNotifications } from '@/components/_icons'
import { useNotifications } from '@/providers/notifications/notifications.hooks'

import { StyledButton } from './NotificationsButton.styles'

export const NotificationsButton = () => {
  const { unseenNotificationsCounts } = useNotifications()
  return <StyledButton variant="secondary" icon={<SvgActionNotifications />} badge={unseenNotificationsCounts} />
}
