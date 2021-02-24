import React from 'react'
import { Meta, Story } from '@storybook/react'
import ActionBar, { ActionBarProps } from './ActionBar'
import ActionBarTransaction from './ActionBarTransaction'

export default {
  title: 'Shared/ActionBar',
  component: ActionBar,
  args: {
    primaryText: 'Fee: 0.2 Joy',
    secondaryText: 'Every change to the blockchain requires making a nominal transaction.',
    detailsText: 'Video details saved as draft (2 min ago)',
    tooltipText:
      'Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft.',
    detailsTextIcon: 'info',
    primaryButtonText: 'Edit the channel',
    secondaryButtonText: 'Cancel',
  },
} as Meta

const Template: Story<ActionBarProps> = (args) => <ActionBar {...args} />

export const Default = Template.bind({})

const TransactionTemplate: Story<ActionBarProps> = (args) => <ActionBarTransaction {...args} fee={1} />

export const Transaction = TransactionTemplate.bind({})
