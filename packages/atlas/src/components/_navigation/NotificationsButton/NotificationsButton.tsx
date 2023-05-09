import { SvgActionNotifications } from '@/assets/icons'
import { useNotifications } from '@/providers/notifications/notifications.hooks'

import { StyledButton } from './NotificationsButton.styles'

export const NotificationsButton = (props: { onClick?: () => void }) => {
  const { unseenNotificationsCounts } = useNotifications()
  return (
    <StyledButton {...props} variant="secondary" icon={<SvgActionNotifications />} badge={unseenNotificationsCounts} />
  )
}
