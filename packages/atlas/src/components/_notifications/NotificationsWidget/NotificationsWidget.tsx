import { FC, useEffect, useRef, useState } from 'react'

import { SvgActionCheck, SvgActionMore, SvgActionNotifications, SvgActionSettings } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Section } from '@/components/Section/Section'
import { Text } from '@/components/Text'
import { Popover, PopoverImperativeHandle, PopoverProps } from '@/components/_overlays/Popover'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useNotifications } from '@/providers/notifications/notifications.hooks'

import {
  Content,
  Header,
  KebabMenuButtonIcon,
  MobileBackdrop,
  StyledContextMenu,
  Wrapper,
} from './NotificationsWidget.styles'

import { NotificationTile } from '../NotificationTile'

type NotificationsWidgetProps = {
  type: 'member' | 'channel'
} & Omit<PopoverProps, 'content' | 'instanceRef'>

export const NotificationsWidget: FC<NotificationsWidgetProps> = ({ type, ...rest }) => {
  const popoverRef = useRef<PopoverImperativeHandle>()
  const {
    notifications,
    markNotificationsAsRead,
    setLastSeenNotificationBlock,
    markNotificationsAsUnread,
    pageInfo,
    fetchMore,
  } = useNotifications()
  const smMatch = useMediaMatch('sm')
  const firstNotification = notifications[0]
  const ref = useRef<HTMLButtonElement>(null)
  const contextMenuInstanceRef = useRef<PopoverImperativeHandle>(null)

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
            <Text as="h3" variant="h300">
              {type === 'member' ? 'Member' : 'Channel'} notifications
            </Text>
            <div>
              <KebabMenuButtonIcon ref={ref} icon={<SvgActionMore />} variant="tertiary" size="small" />
              <StyledContextMenu
                ref={contextMenuInstanceRef}
                appendTo={ref.current ?? undefined}
                placement="bottom-end"
                flipEnabled={false}
                items={[
                  {
                    label: 'Mark all as read',
                    nodeStart: <SvgActionCheck />,
                    onClick: () => markNotificationsAsRead(notifications),
                  },
                  {
                    label: `${type === 'member' ? 'Member' : 'Channel'} notification center`,
                    nodeStart: <SvgActionNotifications />,
                    onClick: popoverRef.current?.hide,
                    to: absoluteRoutes.viewer.notifications(),
                  },
                  {
                    label: `${type === 'member' ? 'Member' : 'Channel'} notification settings`,
                    nodeStart: <SvgActionSettings />,
                    onClick: () => markNotificationsAsRead(notifications),
                  },
                ]}
                trigger={null}
                triggerTarget={ref.current}
              />
            </div>
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
                          onMarkAsUnread={() => markNotificationsAsUnread(notification)}
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
        </Wrapper>
      </Popover>
    </>
  )
}
