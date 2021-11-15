import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Tabs, TabsProps } from './Tabs'

export default {
  title: 'other/Tabs',
  component: Tabs,
  argTypes: {
    tabs: {
      defaultValue: [
        { name: 'one', badgeNumber: 1 },
        { name: 'two', badgeNumber: 2 },
        { name: 'three', badgeNumber: 3 },
        { name: 'four', badgeNumber: 4 },
        { name: 'five', badgeNumber: 5 },
        { name: 'six', badgeNumber: 6 },
      ],
    },
  },
} as Meta

const Template: Story<TabsProps> = (args) => <Tabs {...args} />

export const Default = Template.bind({})
