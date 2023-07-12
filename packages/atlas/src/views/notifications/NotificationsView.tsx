import { useEffect, useRef } from 'react'

import {
  SvgActionArrowRight,
  SvgActionCheck,
  SvgActionChevronL,
  SvgActionClose,
  SvgActionMore,
  SvgActionRead,
  SvgActionSettings,
  SvgActionUnread,
} from '@/assets/icons'
import { GridItem } from '@/components/LayoutGrid'
import { NumberFormat } from '@/components/NumberFormat'
import { BackActionWrapper } from '@/components/PageTabs/PageTabs.styles'
import { Pill } from '@/components/Pill'
import { Section } from '@/components/Section/Section'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { StyledContextMenu } from '@/components/_notifications/NotificationsWidget/NotificationsWidget.styles'
import { PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { absoluteRoutes } from '@/config/routes'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useBottomNavStore } from '@/providers/bottomNav'
import { useNotifications } from '@/providers/notifications/notifications.hooks'
import { createPlaceholderData } from '@/utils/data'

import { useSelectedNotifications } from './Notifications.hooks'
import {
  FloatingActionBar,
  Header,
  KebabButton,
  NotificationEmptyRectangle,
  NotificationEmptyRectangleWithText,
  StyledLayoutGrid,
  StyledNotificationLoader,
  StyledNotificationTile,
  TitleContainer,
} from './NotificationsView.styles'

export const NotificationsView = () => {
  const smMatch = useMediaMatch('sm')
  const open = useBottomNavStore((state) => state.open)
  const headTags = useHeadTags('Member notifications')
  const ref = useRef<HTMLButtonElement>(null)
  const contextMenuInstanceRef = useRef<PopoverImperativeHandle>(null)

  const { selectedNotifications, selectAllNotifications, unselectAllNotifications } = useSelectedNotifications()
  const {
    notifications,
    markNotificationsAsRead,
    markNotificationsAsUnread,
    setLastSeenNotificationBlock,
    pageInfo,
    fetchMore,
    loading,
  } = useNotifications({
    notifyOnNetworkStatusChange: true,
  })

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
  // const markAllAsRead = () => markNotificationsAsRead(notifications)
  const markSelectedAsRead = () => markNotificationsAsRead(selectedNotifications)
  const markSelectedAsUnread = () => markNotificationsAsUnread(selectedNotifications)

  const placeholderItems = createPlaceholderData(loading ? 10 : 0)

  return (
    <StyledLayoutGrid>
      {headTags}
      <GridItem colSpan={{ xxs: 12, md: 10, lg: 8 }} colStart={{ md: 2, lg: 3 }}>
        <Header>
          <BackActionWrapper>
            <Button variant="tertiary" size="medium" icon={<SvgActionChevronL />} />
          </BackActionWrapper>
          <TitleContainer>
            <Text as="h4" variant="h400">
              Member notifications
            </Text>

            {unreadNumber && <Pill label={`${unreadNumber} unread`} />}
          </TitleContainer>

          <KebabButton ref={ref} icon={<SvgActionMore />} variant="secondary" size="small" />
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
                label: `Member notification setting`,
                nodeStart: <SvgActionSettings />,
                to: absoluteRoutes.viewer.notifications(),
              },
              {
                label: `Channel notification center`,
                nodeStart: <SvgActionArrowRight />,
              },
            ]}
            trigger={null}
            triggerTarget={ref.current}
          />
        </Header>

        <div>
          {notifications.length > 0 ? (
            <Section
              contentProps={{
                type: 'grid',
                gap: 2,
                grid: {
                  xxs: {
                    columns: 1,
                  },
                },
                children: [...notifications, ...placeholderItems].map((notification, idx) =>
                  notification.id ? (
                    <StyledNotificationTile
                      key={`notification-${notification.id}-${idx}`}
                      notification={notification}
                      onMarkAsRead={() => markNotificationsAsRead(notification)}
                    />
                  ) : (
                    <StyledNotificationLoader key={idx} />
                  )
                ),
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
