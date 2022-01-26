import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Tabs, TabsProps } from './Tabs'

const badgeTabs = [
  { name: 'one', badgeNumber: 1 },
  { name: 'two', badgeNumber: 2 },
  { name: 'three', badgeNumber: 3 },
  { name: 'four', badgeNumber: 4 },
  { name: 'five', badgeNumber: 5 },
  { name: 'six', badgeNumber: 6 },
]
const pillTabs = [
  { name: 'one', pillText: 1 },
  { name: 'two', pillText: 2 },
  { name: 'three', pillText: 3 },
  { name: 'four', pillText: 4 },
  { name: 'five', pillText: 5 },
  { name: 'six', pillText: 6 },
]

export default {
  title: 'other/Tabs',
  component: Tabs,
  args: {
    onSelectTab: () => null,
  },
} as Meta

const Template: Story<TabsProps> = (args) => (
  <>
    <Tabs {...args} tabs={badgeTabs} />
    <Tabs {...args} tabs={pillTabs} />
  </>
)

export const Default = Template.bind({})
