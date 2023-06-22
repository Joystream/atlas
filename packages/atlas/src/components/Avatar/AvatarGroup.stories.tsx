import { Meta, StoryFn } from '@storybook/react'

import { AvatarGroup, AvatarGroupProps } from './AvatarGroup'

export default {
  title: 'other/AvatarGroup',
  component: AvatarGroup,
  argTypes: {
    avatarStrokeColor: {
      control: {
        type: 'color',
      },
    },
    avatars: { table: { disable: true } },
  },
  args: {
    size: 'medium',
  },
} as Meta

const Template: StoryFn<AvatarGroupProps> = (args) => (
  <div style={{ width: '500px', height: '500px', background: args.avatarStrokeColor, paddingTop: '30px' }}>
    <AvatarGroup {...args} />
  </div>
)

export const Default = Template.bind({})

Default.args = {
  avatars: [
    { urls: ['https://i.pravatar.cc/300'], tooltipText: 'Jane' },
    { urls: ['https://i.pravatar.cc/300'], tooltipText: 'John' },
    { urls: ['https://i.pravatar.cc/300'], tooltipText: 'William' },
    { urls: ['https://i.pravatar.cc/300'], tooltipText: 'One line description' },
  ],
}
