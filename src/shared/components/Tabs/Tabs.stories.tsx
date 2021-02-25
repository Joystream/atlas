import { Meta, Story } from '@storybook/react'
import Tabs, { TabsProps } from './Tabs'
import React from 'react'

export default {
  title: 'Shared/Tabs',
  component: Tabs,
  argTypes: {
    tabs: {
      defaultValue: ['one', 'two', 'three', 'four', 'five', 'six'],
    },
  },
} as Meta

const Template: Story<TabsProps> = (args) => <Tabs {...args} />

export const Default = Template.bind({})
