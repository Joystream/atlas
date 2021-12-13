import { Meta, Story } from '@storybook/react'
import React from 'react'

import { MemberDropdown, MemberDropdownProps } from './MemberDropdown'

export default {
  title: 'overlays/MemberDropdown',
  component: MemberDropdown,
  argTypes: {
    // size: {
    //   control: { type: 'select', options: ['small', 'medium', 'large'] },
    //   defaultValue: 'medium',
    // },
  },
  args: {
    avatarUrl: 'https://joyrq.com/storage/asset/v0/5CjjBKcMMke3TFUNZuuiLcGKqYpWR8TnVbCLTmK5u5JGGFTS',
    // label: 'MemberDropdown label',
  },
} as Meta

const Template: Story<MemberDropdownProps> = (args) => <MemberDropdown {...args} />

export const Default = Template.bind({})
