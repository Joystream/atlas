import { Meta, Story } from '@storybook/react'
import ActionBar, { ActionBarProps } from './ActionBar'
import React from 'react'

export default {
  title: 'Shared/ActionBar',
  component: ActionBar,
  args: {
    primaryText: 'Fee: 0.2 Joy',
    secondaryText: 'Every change to the blockchain requires making a nominal transaction.',
    primaryButtonText: 'Start Publishing',
    secondaryButtonText: 'Save As Draft',
  },
  argTypes: {
    variant: {
      defaultValue: 'primary',
    },
  },
} as Meta

const Template: Story<ActionBarProps> = (args) => <ActionBar {...args} />

export const Default = Template.bind({})
