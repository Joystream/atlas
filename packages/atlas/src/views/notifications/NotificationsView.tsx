import { useEffect } from 'react'

import { SvgActionClose, SvgActionRead, SvgActionUnread } from '@/assets/icons'
import { GridItem } from '@/components/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useBottomNavStore } from '@/providers/bottomNav'
import { useNotifications } from '@/providers/notifications/notifications.hooks'

import { useSelectedNotifications } from './Notifications.hooks'
import {
  FloatingActionBar,
  Header,
  MarkAllReadWrapper,
  NotificationEmptyRectangle,
  NotificationEmptyRectangleWithText,
  StyledLayoutGrid,
  StyledNotificationTile,
  StyledPill,
} from './NotificationsView.styles'

export const NotificationsView = () => {
  const smMatch = useMediaMatch('sm')
  const open = useBottomNavStore((state) => state.open)

  const { selectedNotifications, setNotificationSelected, selectAllNotifications, unselectAllNotifications } =
    useSelectedNotifications()
  const { notifications, markNotificationsAsRead, markNotificationsAsUnread, setLastSeenNotificationBlock } =
    useNotifications()
  const firstNotification = notifications[0]

  // set last seen notification block to first notification to manage the badge for notification button
  useEffect(() => {
    if (!firstNotification) return
    setLastSeenNotificationBlock(firstNotification.block)
  }, [firstNotification, setLastSeenNotificationBlock])

  const unreadNumber = notifications.filter((notification) => !notification.read).length
  const hasSelectedSomeUnreadNotifications = selectedNotifications.some((notification) => !notification.read)

  const closeButtonNode = (
    <Button
      variant="tertiary"
      size={smMatch ? 'large' : 'medium'}
      onClick={unselectAllNotifications}
      icon={<SvgActionClose />}
    />
  )

  const markAllAsRead = () => markNotificationsAsRead(notifications)
  const markSelectedAsRead = () => markNotificationsAsRead(selectedNotifications)
  const markSelectedAsUnread = () => markNotificationsAsUnread(selectedNotifications)
  return (
    <StyledLayoutGrid>
      <GridItem colSpan={{ xxs: 12, md: 10, lg: 8 }} colStart={{ md: 2, lg: 3 }}>
        <Header>
          <Text as="h1" variant={smMatch ? 'h700' : 'h600'}>
            Notifications
          </Text>
          {!!unreadNumber && (
            <>
              <StyledPill label={`${unreadNumber} unread`} />
              <MarkAllReadWrapper>
                <Button variant="secondary" size="small" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              </MarkAllReadWrapper>
            </>
          )}
        </Header>

        <div>
          {notifications.length > 0 ? (
            notifications.map((notification, idx) => (
              <StyledNotificationTile
                key={`notification-${notification.id}-${idx}`}
                notification={notification}
                selected={!!selectedNotifications.find((notif) => notif.id === notification.id)}
                onCheckboxChange={(selected, e) => {
                  setNotificationSelected(notification, selected)
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={() => markNotificationsAsRead(notification)}
              />
            ))
          ) : (
            <NotificationsEmptyFallback />
          )}
        </div>
      </GridItem>

      {selectedNotifications.length > 0 && (
        <FloatingActionBar data-bottom-nav-open={open}>
          <Text
            as="span"
            variant="t300"
            color="colorText"
            margin={{ right: smMatch ? 8 : undefined, left: !smMatch ? 4 : undefined }}
          >
            <NumberFormat as="span" value={selectedNotifications.length} format="short" variant="t300" /> item(s)
            selected
          </Text>
          {!smMatch && closeButtonNode}
          <Button size="large" variant="tertiary" onClick={() => selectAllNotifications(notifications)}>
            Select all
          </Button>
          <Button
            size="large"
            icon={smMatch ? hasSelectedSomeUnreadNotifications ? <SvgActionUnread /> : <SvgActionRead /> : undefined}
            variant="tertiary"
            onClick={() => {
              hasSelectedSomeUnreadNotifications ? markSelectedAsRead() : markSelectedAsUnread()
              unselectAllNotifications()
            }}
          >
            Mark as {hasSelectedSomeUnreadNotifications ? 'read' : 'unread'}
          </Button>
          {smMatch && closeButtonNode}
        </FloatingActionBar>
      )}
    </StyledLayoutGrid>
  )
}

const NotificationsEmptyFallback = () => {
  return (
    <>
      <NotificationEmptyRectangle />
      <NotificationEmptyRectangle opacity={0.8} />
      <NotificationEmptyRectangleWithText>
        <NotificationEmptyRectangle opacity={0.5} absolute />
        <Text as="p" variant="h500" color="colorText">
          You don’t have any notifications
        </Text>
      </NotificationEmptyRectangleWithText>
      <NotificationEmptyRectangle opacity={0.3} />
      <NotificationEmptyRectangle opacity={0.1} />
    </>
  )
}
