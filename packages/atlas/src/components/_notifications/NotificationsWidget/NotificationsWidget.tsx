import { FC, useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { SvgActionCheck, SvgActionMore, SvgActionNotifications, SvgActionSettings } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Section } from '@/components/Section/Section'
import { Text } from '@/components/Text'
import { StyledNotificationLoader } from '@/components/_notifications/NotificationsViewContent/NotificationsViewContent.styles'
import { Popover, PopoverImperativeHandle, PopoverProps } from '@/components/_overlays/Popover'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useNotifications } from '@/providers/notifications/notifications.hooks'
import { transitions } from '@/styles'
import { createPlaceholderData } from '@/utils/data'

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
    loading,
  } = useNotifications()
  const smMatch = useMediaMatch('sm')
  const firstNotification = notifications[0]
  const [ref, setRef] = useState<HTMLButtonElement | null>()
  const contextMenuInstanceRef = useRef<PopoverImperativeHandle>(null)
  const isMemberType = type === 'member'
  const [isOpen, setIsOpen] = useState(false)
  const placeholderItems = createPlaceholderData(loading ? 10 : 0)

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
        <CSSTransition classNames={transitions.names.dropdown} in={isOpen} timeout={0} mountOnEnter unmountOnExit>
          <Wrapper>
            <Header>
              <Text as="h3" variant="h300">
                {isMemberType ? 'Member' : 'Channel'} notifications
              </Text>
              <div>
                <KebabMenuButtonIcon
                  ref={(ref) => setRef(ref)}
                  icon={<SvgActionMore />}
                  variant="tertiary"
                  size="small"
                />
                <StyledContextMenu
                  ref={contextMenuInstanceRef}
                  appendTo={ref ?? undefined}
                  placement="bottom-end"
                  flipEnabled={false}
                  items={[
                    {
                      label: 'Mark all as read',
                      nodeStart: <SvgActionCheck />,
                      onClick: () => markNotificationsAsRead(notifications),
                    },
                    {
                      label: `${isMemberType ? 'Member' : 'Channel'} notification center`,
                      nodeStart: <SvgActionNotifications />,
                      onClick: popoverRef.current?.hide,
                      to: isMemberType
                        ? absoluteRoutes.viewer.memberNotifications()
                        : absoluteRoutes.studio.channelNotifications(),
                    },
                    {
                      label: `${isMemberType ? 'Member' : 'Channel'} notification settings`,
                      nodeStart: <SvgActionSettings />,
                      onClick: () => markNotificationsAsRead(notifications),
                    },
                  ]}
                  trigger={null}
                  triggerTarget={ref}
                />
              </div>
            </Header>
            <Content>
              {notifications.length > 0 || loading ? (
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
                        {[...notifications, ...placeholderItems].map((notification, idx) =>
                          notification.id ? (
                            <NotificationTile
                              key={`notification-${notification.id}-${idx}`}
                              notification={notification}
                              onClick={() => {
                                popoverRef.current?.hide()
                              }}
                              onMarkAsRead={() => markNotificationsAsRead(notification)}
                              onMarkAsUnread={() => markNotificationsAsUnread(notification)}
                            />
                          ) : (
                            <StyledNotificationLoader key={idx} />
                          )
                        )}
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
        </CSSTransition>
      </Popover>
    </>
  )
}
