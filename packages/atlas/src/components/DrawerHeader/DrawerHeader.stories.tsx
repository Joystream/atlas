import { Meta, Story } from '@storybook/react'
import React from 'react'

import { DrawerHeader, DrawerHeaderProps } from './DrawerHeader'

export default {
  title: 'Other/DrawerHeader',
  component: DrawerHeader,
  argTypes: {
    onCloseClick: { table: { disable: true } },
  },
  args: {
    label: 'New',
    title:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    onCloseClick: () => null,
  },
} as Meta

const Template: Story<DrawerHeaderProps> = (args) => <DrawerHeader {...args} />

export const Default = Template.bind({})
