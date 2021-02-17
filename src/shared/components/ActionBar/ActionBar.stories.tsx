import { Meta, Story } from '@storybook/react'
import ActionBar from './ActionBar'
import React from 'react'

export default {
  title: 'Shared/ActionBar',
  component: ActionBar,
} as Meta

const Template: Story = (args) => <ActionBar {...args} />

export const Default = Template.bind({})
