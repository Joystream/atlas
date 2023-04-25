import { FC, useEffect, useRef, useState } from 'react'

import { SvgActionNotifications } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Section } from '@/components/Section/Section'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { Popover, PopoverImperativeHandle, PopoverProps } from '@/components/_overlays/Popover'
import { absoluteRoutes } from '@/config/routes'
import { useNotifications } from '@/providers/notifications/notifications.hooks'
import { createPlaceholderData } from '@/utils/data'

import { Content, Header, StyledButton, StyledCompactNotificationLoader, Wrapper } from './NotificationsWidget.styles'

import { NotificationTile } from '../NotificationTile'

type NotificationsWidgetProps = Omit<PopoverProps, 'content' | 'instanceRef'>

export const NotificationsWidget: FC<NotificationsWidgetProps> = ({ ...rest }) => {
  const popoverRef = useRef<PopoverImperativeHandle>()
  const { notifications, markNotificationsAsRead, setLastSeenNotificationBlock, loading, pageInfo, fetchMore } =
    useNotifications()
  const [isLoading, setIsLoading] = useState(false)
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

  const placeholderItems = createPlaceholderData(loading || isLoading ? 10 : 0)

  return (
    <Popover hideOnClick ref={popoverRef} {...rest} onShow={handleShow} onHide={handleHide}>
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
                minChildrenWidth: 300,
                type: 'grid',
                children: [
                  <div key="single">
                    {[...notifications, ...placeholderItems].map((notification, idx) =>
                      notification.id ? (
                        <NotificationTile
                          variant="compact"
                          key={`notification-${notification.id}-${idx}`}
                          notification={notification}
                          onClick={() => {
                            popoverRef.current?.hide()
                            markNotificationsAsRead(notification)
                          }}
                        />
                      ) : (
                        <StyledCompactNotificationLoader key={idx} />
                      )
                    )}
                  </div>,
                ],
              }}
              footerProps={{
                type: 'infinite',
                reachedEnd: !pageInfo?.hasNextPage ?? true,
                fetchMore: async () => {
                  setIsLoading(true)
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
                  }).finally(() => setIsLoading(false))
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
  )
}
