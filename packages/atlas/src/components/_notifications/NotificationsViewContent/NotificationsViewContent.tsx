import { useRef } from 'react'
import { useNavigate } from 'react-router'

import {
  SvgActionArrowRight,
  SvgActionCheck,
  SvgActionChevronL,
  SvgActionMore,
  SvgActionSettings,
} from '@/assets/icons'
import { GridItem } from '@/components/LayoutGrid'
import { BackActionWrapper } from '@/components/PageTabs/PageTabs.styles'
import { Pill } from '@/components/Pill'
import { Section } from '@/components/Section/Section'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { StyledContextMenu } from '@/components/_notifications/NotificationsWidget/NotificationsWidget.styles'
import { PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { absoluteRoutes } from '@/config/routes'
import { UseNotifications } from '@/providers/notifications/notifications.hooks'
import { createPlaceholderData } from '@/utils/data'

import {
  Header,
  KebabButton,
  NotificationEmptyRectangle,
  NotificationEmptyRectangleWithText,
  StyledLayoutGrid,
  StyledNotificationLoader,
  StyledNotificationTile,
  TitleContainer,
} from './NotificationsViewContent.styles'

type NotificationsViewContentProps = {
  type: 'channel' | 'member'
  unreadNumber?: number
} & UseNotifications

export const NotificationsViewContent = ({
  unreadNumber,
  markNotificationsAsRead,
  markNotificationsAsUnread,
  notifications,
  loading,
  pageInfo,
  fetchMore,
  type,
}: NotificationsViewContentProps) => {
  const ref = useRef<HTMLButtonElement>(null)
  const contextMenuInstanceRef = useRef<PopoverImperativeHandle>(null)
  const placeholderItems = createPlaceholderData(loading ? 10 : 0)
  const isMemberType = type === 'member'
  const navigate = useNavigate()

  return (
    <StyledLayoutGrid>
      <GridItem colSpan={{ xxs: 12, md: 10, lg: 8 }} colStart={{ md: 2, lg: 3 }}>
        <Header>
          <BackActionWrapper>
            <Button variant="tertiary" size="medium" icon={<SvgActionChevronL />} onClick={() => navigate(-1)} />
          </BackActionWrapper>
          <TitleContainer>
            <Text as="h4" variant="h400">
              {isMemberType ? 'Member' : 'Channel'} notifications
            </Text>
            {unreadNumber ? <Pill label={`${unreadNumber} unread`} /> : null}
          </TitleContainer>

          <KebabButton ref={ref} icon={<SvgActionMore />} variant="secondary" size="small" />
          <StyledContextMenu
            ref={contextMenuInstanceRef}
            appendTo={document.body}
            placement="bottom-end"
            flipEnabled={false}
            items={[
              {
                label: 'Mark all as read',
                nodeStart: <SvgActionCheck />,
                onClick: () => markNotificationsAsRead(notifications),
              },
              {
                label: `${isMemberType ? 'Member' : 'Channel'} notification setting`,
                nodeStart: <SvgActionSettings />,
              },
              {
                label: `${isMemberType ? 'Channel' : 'Member'} notification center`,
                nodeStart: <SvgActionArrowRight />,
                to: isMemberType
                  ? absoluteRoutes.studio.channelNotifications()
                  : absoluteRoutes.viewer.memberNotifications(),
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
                      onMarkAsUnread={() => markNotificationsAsUnread(notification)}
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
                      fetchMoreResult.notificationInAppDeliveriesConnection.edges = [
                        ...(prev.notificationInAppDeliveriesConnection?.edges ?? []),
                        ...fetchMoreResult.notificationInAppDeliveriesConnection.edges,
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
