import { SvgActionNotifications } from '@/assets/icons'
import { ButtonProps } from '@/components/_buttons/Button'

import { StyledButton } from './NotificationsButton.styles'

export const NotificationsButton = (props: ButtonProps) => {
  return <StyledButton {...props} variant="secondary" icon={<SvgActionNotifications />} />
}
