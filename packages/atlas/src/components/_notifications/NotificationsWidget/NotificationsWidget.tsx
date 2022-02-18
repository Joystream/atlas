import React, { useRef } from 'react'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionNotifications } from '@/components/_icons'
import { Popover, PopoverImperativeHandle, PopoverProps } from '@/components/_overlays/Popover'
import { absoluteRoutes } from '@/config/routes'

import { Content, Header, Wrapper } from './NotificationsWidget.styles'

import { NotificationTile } from '../NotificationTile'

type NotificationsWidgetProps = Omit<PopoverProps, 'content' | 'instanceRef'>

const NOTIFICATIONS = [
  {
    id: '0',
    author: 'DREAM TEAM',
    text: 'outbid you at an auction for 32K tJOY',
    date: new Date(Date.now() - 1000000),
    avatarUrl: 'https://placedog.net/400/400?random&1',
    videoTitle: 'Know your Councils #02 (CheOmsk)',
    read: false,
  },
  {
    id: '1',
    author: 'Joystream movie',
    text: 'withdrew their bid',
    date: new Date(Date.now() - 9000000),
    avatarUrl: 'https://placedog.net/400/400?random&2',
    videoTitle: 'Как заработать в крипте БЕЗ вложений?',
    read: true,
  },
  {
    id: '2',
    author: 'Joystream movie',
    text: 'withdrew their bid',
    date: new Date(Date.now() - 299000000),
    avatarUrl: 'https://placedog.net/400/400?random&2',
    videoTitle: 'Как заработать в крипте БЕЗ вложений?',
    read: true,
  },
  {
    id: '3',
    author: 'You',
    text: 'won the auction',
    date: new Date(Date.now() - 35000000000),
    avatarUrl: 'https://placedog.net/400/400?random&3',
    videoTitle: 'Atlas guide for RU community',
    read: false,
  },
  {
    id: '4',
    author: 'You',
    text: 'won the auction',
    date: new Date(Date.now() - 35000000000),
    avatarUrl: 'https://placedog.net/400/400?random&4',
    videoTitle: 'Atlas guide for RU community',
    read: false,
  },
  {
    id: '5',
    author: 'You',
    text: 'won the auction',
    date: new Date(Date.now() - 35000000000),
    avatarUrl: 'https://placedog.net/400/400?random&5',
    videoTitle: 'Atlas guide for RU community',
    read: false,
  },
  {
    id: '6',
    author: 'You',
    text: 'won the auction',
    date: new Date(Date.now() - 35000000000),
    avatarUrl: 'https://placedog.net/400/400?random&6',
    videoTitle: 'Atlas guide for RU community',
    read: false,
  },
]

export const NotificationsWidget: React.FC<NotificationsWidgetProps> = ({ ...rest }) => {
  const popoverRef = useRef<PopoverImperativeHandle>()
  return (
    <Popover hideOnClick ref={popoverRef} {...rest}>
      <Wrapper>
        <Header>
          <Text variant="h400">Notifications</Text>
          <Button variant="secondary" size="small">
            Mark all as read
          </Button>
        </Header>
        <Content>
          {NOTIFICATIONS.map((notification, idx) => (
            <NotificationTile variant="compact" key={`notification-${notification.id}-${idx}`} {...notification} />
          ))}
        </Content>
        <Button
          variant="tertiary"
          size="large"
          icon={<SvgActionNotifications />}
          fullWidth
          to={absoluteRoutes.viewer.notifications()}
          onClick={popoverRef.current?.hide}
        >
          <Text variant="t100">Go to notification center</Text>
        </Button>
      </Wrapper>
    </Popover>
  )
}
