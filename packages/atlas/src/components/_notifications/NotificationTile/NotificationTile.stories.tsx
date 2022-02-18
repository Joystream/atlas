import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { NotificationProps, NotificationTile } from './NotificationTile'

export default {
  title: 'Other/NotificationTile',
  component: NotificationTile,
  argTypes: {
    onSelect: { table: { disable: true } },
    id: { table: { disable: true } },
    className: { table: { disable: true } },
    selected: { table: { disable: true } },
    date: { control: { type: 'date' } },
  },
  args: {
    avatarUrl: 'https://placedog.net/400/400?random&1',
    videoTitle: 'Lorem ipsum',
    author: 'Света Василенко',
    text: 'outbid you at an auction for 32K tJOY',
    date: new Date(Date.now() - 10000000),
    read: false,
    loading: false,
    variant: 'default',
  },
} as Meta

const Template: Story<NotificationProps> = (args) => {
  const [selected, setSelected] = useState(false)
  return <NotificationTile {...args} selected={selected} onSelect={() => setSelected(!selected)} />
}

export const Default = Template.bind({})
