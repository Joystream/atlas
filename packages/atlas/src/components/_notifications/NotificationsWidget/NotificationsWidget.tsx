import { FC, useEffect, useRef, useState } from 'react'

import { SvgActionNotifications } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Section } from '@/components/Section/Section'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { Popover, PopoverImperativeHandle, PopoverProps } from '@/components/_overlays/Popover'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useNotifications } from '@/providers/notifications/notifications.hooks'

import { Content, Header, MobileBackdrop, StyledButton, Wrapper } from './NotificationsWidget.styles'

import { NotificationTile } from '../NotificationTile'

type NotificationsWidgetProps = Omit<PopoverProps, 'content' | 'instanceRef'>

export const NotificationsWidget: FC<NotificationsWidgetProps> = ({ ...rest }) => {
  const popoverRef = useRef<PopoverImperativeHandle>()
  const { notifications, markNotificationsAsRead, setLastSeenNotificationBlock, pageInfo, fetchMore } =
    useNotifications()
  const smMatch = useMediaMatch('sm')
  const firstNotification = notifications[0]

  const [isOpen, setIsOpen] = useState(false)

  // set last seen notification block to first notification to manage the badge for notification button
  useEffect(() => {
    if (!firstNotification || !isOpen) return
    setLastSeenNotificationBlock(firstNotification.block)
  }, [firstNotification, isOpen, setLastSeenNotificationBlock])

  const handleShow = () => {
    rest.onShow?.()
    setIsOpen(true)
  }

  const handleHide = () => {
    rest.onHide?.()
    setIsOpen(false)
  }

  return (
    <>
      {!smMatch && isOpen && <MobileBackdrop />}
      <Popover
        hideOnClick
        boundariesElement={document.body}
        ref={popoverRef}
        {...rest}
        onShow={handleShow}
        appendTo={document.body}
        onHide={handleHide}
      >
        <Wrapper>
          <Header>
            <Text as="h3" variant="h400">
              Notifications
            </Text>
            <Button variant="secondary" size="small" onClick={() => markNotificationsAsRead(notifications)}>
              Mark all as read
            </Button>
          </Header>
          <Content>
            {notifications.length > 0 ? (
              <Section
                withoutGap
                contentProps={{
                  type: 'grid',
                  grid: {
                    sm: {
                      columns: 1,
                    },
                  },
                  children: [
                    <div key="single">
                      {notifications.map((notification, idx) => (
                        <NotificationTile
                          key={`notification-${notification.id}-${idx}`}
                          notification={notification}
                          onClick={() => {
                            popoverRef.current?.hide()
                          }}
                          onMarkAsRead={() => markNotificationsAsRead(notification)}
                        />
                      ))}
                    </div>,
                  ],
                }}
                footerProps={{
                  type: 'infinite',
                  reachedEnd: !pageInfo?.hasNextPage ?? true,
                  fetchMore: async () => {
                    await fetchMore({
                      variables: {
                        after: pageInfo?.endCursor,
                        first: 10,
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        fetchMoreResult.notificationsConnection.edges = [
                          ...(prev.notificationsConnection?.edges ?? []),
                          ...fetchMoreResult.notificationsConnection.edges,
                        ]
                        return fetchMoreResult
                      },
                    })
                  },
                }}
              />
            ) : (
              <EmptyFallback variant="small" title="You don't have any notifications" />
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
            <Text as="span" variant="t100">
              Go to notification center
            </Text>
          </StyledButton>
        </Wrapper>
      </Popover>
    </>
  )
}
