import { Meta, Story } from '@storybook/react'
import React from 'react'
import AccountBar, { AccountBarProps } from './AccountBar'

export default {
  title: 'Shared/AccountBar',
  component: AccountBar,
  argTypes: {
    name: {
      defaultValue: 'Account name',
    },
    secondary: {
      defaultValue: 'Some secondary name',
    },
    avatarUrl: {
      defaultValue: 'https://picsum.photos/200',
    },
  },
} as Meta

const Template: Story<AccountBarProps> = (args) => {
  return <AccountBar {...args} />
}

export const Default = Template.bind({})
