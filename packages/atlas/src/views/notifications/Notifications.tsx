import React from 'react'

import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { useSelectedNotifications } from './Notifications.hooks'
import {
  Header,
  MarkAllReadWrapper,
  StyledLayoutGrid,
  StyledNotificationTile,
  StyledPill,
} from './Notifications.styles'

const UNREADS = 10

const NOTIFICATIONS = [
  {
    id: '0',
    author: 'DREAM TEAM',
    text: 'outbid you at an auction for 32K tJOY',
    date: 'Nov 13',
    avatarUrl: 'https://placedog.net/400/400?random&1',
    videoTitle: 'Know your Councils #02 (CheOmsk)',
    read: false,
  },
  {
    id: '1',
    author: 'Joystream movie',
    text: 'withdrew their bid',
    date: 'Nov 13',
    avatarUrl: 'https://placedog.net/400/400?random&2',
    videoTitle: 'Как заработать в крипте БЕЗ вложений?',
    read: true,
  },
  {
    id: '2',
    author: 'You',
    text: 'won the auction',
    date: 'Nov 13',
    avatarUrl: 'https://placedog.net/400/400?random&3',
    videoTitle: 'Atlas guide for RU community',
    read: false,
  },
]

export const Notifications = () => {
  const { selectedNotifications, toggleSelected } = useSelectedNotifications()
  const smMatch = useMediaMatch('sm')
  return (
    <StyledLayoutGrid>
      <GridItem colSpan={{ xxs: 12, md: 10, lg: 8 }} colStart={{ md: 2, lg: 3 }}>
        <Header>
          <Text variant={smMatch ? 'h700' : 'h600'}>Notifications</Text>
          {!!UNREADS && (
            <>
              <StyledPill label={`${UNREADS} unread`} />
              <MarkAllReadWrapper>
                <Button variant="secondary" size="small">
                  Mark all as read
                </Button>
              </MarkAllReadWrapper>
            </>
          )}
        </Header>
        <div>
          {NOTIFICATIONS.map((notification, idx) => (
            <StyledNotificationTile
              key={`notification-${notification.id}-${idx}`}
              {...notification}
              onSelect={() => toggleSelected(notification.id)}
              selected={selectedNotifications.includes(notification.id)}
            />
          ))}
        </div>
      </GridItem>
    </StyledLayoutGrid>
  )
}
