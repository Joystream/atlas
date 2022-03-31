import React from 'react'

import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useNotifications } from '@/providers/notifications'

import { useSelectedNotifications } from './Notifications.hooks'
import {
  Header,
  MarkAllReadWrapper,
  StyledLayoutGrid,
  StyledNotificationTile,
  StyledPill,
} from './Notifications.styles'

export const Notifications = () => {
  const { selectedNotifications, setNotificationSelected } = useSelectedNotifications()
  const smMatch = useMediaMatch('sm')

  const { notifications, markNotificationAsRead } = useNotifications()

  const unreadNumber = notifications.filter((notification) => !notification.read).length
  return (
    <StyledLayoutGrid>
      <GridItem colSpan={{ xxs: 12, md: 10, lg: 8 }} colStart={{ md: 2, lg: 3 }}>
        <Header>
          <Text variant={smMatch ? 'h700' : 'h600'}>Notifications</Text>
          {!!unreadNumber && (
            <>
              <StyledPill label={`${unreadNumber} unread`} />
              <MarkAllReadWrapper>
                <Button variant="secondary" size="small">
                  Mark all as read
                </Button>
              </MarkAllReadWrapper>
            </>
          )}
        </Header>
        <div>
          {notifications.map((notification, idx) => (
            <StyledNotificationTile
              key={`notification-${notification.id}-${idx}`}
              notification={notification}
              selected={selectedNotifications.includes(notification.id)}
              onCheckboxChange={(selected) => setNotificationSelected(notification.id, selected)}
              onClick={() => markNotificationAsRead(notification.id)}
            />
          ))}
        </div>
      </GridItem>
    </StyledLayoutGrid>
  )
}
