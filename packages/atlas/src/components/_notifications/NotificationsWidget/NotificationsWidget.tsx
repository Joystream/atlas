import React, { useRef } from 'react'

import { EmptyFallback } from '@/components/EmptyFallback'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionNotifications } from '@/components/_icons'
import { Popover, PopoverImperativeHandle, PopoverProps } from '@/components/_overlays/Popover'
import { absoluteRoutes } from '@/config/routes'
import { useNotifications } from '@/providers/notifications'

import { Content, Header, StyledButton, Wrapper } from './NotificationsWidget.styles'

import { NotificationTile } from '../NotificationTile'

type NotificationsWidgetProps = Omit<PopoverProps, 'content' | 'instanceRef'>

export const NotificationsWidget: React.FC<NotificationsWidgetProps> = ({ ...rest }) => {
  const popoverRef = useRef<PopoverImperativeHandle>()
  const { notifications, markNotificationsAsRead } = useNotifications()

  return (
    <Popover hideOnClick ref={popoverRef} {...rest}>
      <Wrapper>
        <Header>
          <Text variant="h400">Notifications</Text>
          <Button
            variant="secondary"
            size="small"
            onClick={() => markNotificationsAsRead(notifications.map((notif) => notif.id))}
          >
            Mark all as read
          </Button>
        </Header>
        <Content>
          {notifications.length > 0 ? (
            notifications.map((notification, idx) => (
              <NotificationTile
                variant="compact"
                key={`notification-${notification.id}-${idx}`}
                notification={notification}
                onClick={() => {
                  popoverRef.current?.hide()
                  markNotificationAsRead(notification.id)
                }}
              />
            ))
          ) : (
            <EmptyFallback variant="small" title="You don’t have any notifications" />
          )}
        </Content>
        <StyledButton
          variant="tertiary"
          size="large"
          icon={<SvgActionNotifications />}
          fullWidth
          to={absoluteRoutes.viewer.notifications()}
          onClick={popoverRef.current?.hide}
        >
          <Text variant="t100">Go to notification center</Text>
        </StyledButton>
      </Wrapper>
    </Popover>
  )
}
