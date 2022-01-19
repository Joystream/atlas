import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Switch } from './Switch'

export default {
  title: 'inputs/Switch',
  component: Switch,
} as Meta

const Template: Story = (args) => <Switch {...args} />

export const Default = Template.bind({})
