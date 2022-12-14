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
    { url: 'https://thispersondoesnotexist.com/image', tooltipText: 'Jane' },
    { url: 'https://thispersondoesnotexist.com/image', tooltipText: 'John' },
    { url: 'https://thispersondoesnotexist.com/image', tooltipText: 'William' },
    { url: 'https://thispersondoesnotexist.com/image', tooltipText: 'One line description' },
  ],
}
