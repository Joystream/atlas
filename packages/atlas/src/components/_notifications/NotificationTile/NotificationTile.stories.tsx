import { Meta, StoryFn } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import { NotificationRecord } from '@/providers/notifications/notifications.types'

import { NotificationProps, NotificationTile } from './NotificationTile'

export default {
  title: 'Other/NotificationTile',
  component: NotificationTile,
  argTypes: {
    onSelect: { table: { disable: true } },
    id: { table: { disable: true } },
    selected: { table: { disable: true } },
    date: { control: { type: 'date' } },
    type: { options: ['bid-made', 'bought', 'open-auction-ended'], control: { type: 'radio' } },
  },
  args: {
    read: false,
    type: 'bid-made',
    bidAmount: 32000,
    memberHandle: 'member',
    memberAvatarUrl: 'https://placedog.net/400/400?random&1',
    videoTitle: 'Video title',
    loading: false,
    variant: 'default',
  },
  decorators: [
    (Story) => (
      <>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </>
    ),
  ],
} as Meta<NotificationProps>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Template: StoryFn<any> = (args) => {
  const notification: NotificationRecord = {
    id: 'id',
    date: new Date(Date.now() - 10000000),
    block: 10000,
    read: args.read,
    type: args.type,
    bidAmount: args.bidAmount,
    member: {
      id: 'member',
      handle: args.memberHandle,
      metadata: {
        avatar: {
          __typename: 'AvatarUri',
          avatarUri: args.memberAvatarUrl,
        },
      },
    },
    video: {
      id: 'video',
      title: args.videoTitle,
    },
  }
  return <NotificationTile {...args} notification={notification} />
}

export const Default = Template.bind({})
