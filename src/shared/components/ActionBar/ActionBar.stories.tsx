import { Meta, Story } from '@storybook/react'
import React from 'react'

import { SvgGlyphInfo } from '@/shared/icons'

import { ActionBar, ActionBarProps } from './ActionBar'
import { ActionBarTransaction, ActionBarTransactionProps } from './ActionBarTransaction'

export default {
  title: 'Shared/A/ActionBar',
  component: ActionBar,
  args: {
    primaryText: 'Fee: 0.2 Joy',
    secondaryText: 'Every change to the blockchain requires making a nominal transaction.',
    detailsText: 'Video details saved as draft (2 min ago)',
    tooltipText:
      'Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft.',
    primaryButtonText: 'Edit the channel',
    secondaryButtonText: 'Cancel',
    fee: 1,
    isActive: true,
  },
} as Meta

const Template: Story<ActionBarProps> = (args) => <ActionBar detailsTextIcon={<SvgGlyphInfo />} {...args} />

export const Default = Template.bind({})

const TransactionTemplate: Story<ActionBarTransactionProps> = (args) => <ActionBarTransaction {...args} />

export const Transaction = TransactionTemplate.bind({})
