import { Meta, Story } from '@storybook/react'
import React from 'react'

import { AvatarGroup, AvatarGroupProps } from './AvatarGroup'

export default {
  title: 'other/AvatarGroup',
  component: AvatarGroup,
} as Meta

const Template: Story<AvatarGroupProps> = (args) => <AvatarGroup {...args} />

export const Default = Template.bind({})

Default.args = {
  avatars: [
    { assetUrl: 'https://picsum.photos/200/300' },
    { assetUrl: 'https://picsum.photos/200/300' },
    { assetUrl: 'https://picsum.photos/200/300' },
    { assetUrl: 'https://picsum.photos/200/300' },
  ],
  size: 'small',
}
