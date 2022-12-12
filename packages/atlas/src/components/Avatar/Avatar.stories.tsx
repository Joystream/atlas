import { Meta, StoryFn } from '@storybook/react'

import { Avatar } from './Avatar'

export default {
  title: 'other/Avatar',
  component: Avatar,
  argTypes: {
    assetUrl: {
      type: 'string',
      defaultValue: 'https://picsum.photos/200/300',
    },
    size: {
      control: {
        type: 'select',
        options: ['preview', 'cover', 'default', 'fill', 'bid', 'small', 'channel', 'channel-card'],
      },
      defaultValue: 'channel',
    },
    editable: { type: 'boolean', defaultValue: false },
    clickable: { type: 'boolean', defaultValue: false },
    loading: { type: 'boolean', defaultValue: false },
  },
} as Meta

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Template: StoryFn<any> = (args) => (
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  <Avatar {...args} onClick={args.editable || args.clickable ? () => {} : undefined} />
)

export const Default = Template.bind({})
