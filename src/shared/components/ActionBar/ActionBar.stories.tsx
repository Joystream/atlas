import React from 'react'
import { Meta, Story } from '@storybook/react'
import ActionBar, { ActionBarProps } from './ActionBar'

export default {
  title: 'Shared/ActionBar',
  component: ActionBar,
  args: {
    primaryText: 'Fee: 0.2 Joy',
    secondaryText: 'Every change to the blockchain requires making a nominal transaction.',
    detailsText: 'Video details saved as draft (2 min ago)',
    detailsTextIcon: 'info',
    primaryButtonText: 'Edit the channel (0.2 JOY)',
    secondaryButtonText: 'Cancel',
  },
} as Meta

const Template: Story<ActionBarProps> = (args) => <ActionBar {...args} />

export const Default = Template.bind({})
