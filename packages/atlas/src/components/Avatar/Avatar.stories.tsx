import { Meta, StoryFn } from '@storybook/react'

import { Avatar, AvatarProps } from './Avatar'

export default {
  title: 'other/Avatar',
  component: Avatar,
  args: {
    assetUrls: ['https://picsum.photos/200/300'],
  },
} as Meta<AvatarProps>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Template: StoryFn<any> = (args) => (
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  <Avatar {...args} onClick={args.editable || args.clickable ? () => {} : undefined} />
)

export const Default = Template.bind({})
