import { Meta, Story } from '@storybook/react'
import React from 'react'

import { ActionBar, ActionBarProps } from './ActionBar'

export default {
  title: 'other/ActionBar',
  component: ActionBar,
  args: {
    primaryButton: {
      text: 'Edit the channel',
    },
    secondaryButton: {
      text: 'Cancel',
    },
    primaryText: 'Fee: 0.2 Joy',
    secondaryText: 'Every change to the blockchain requires making a nominal transaction.',
    detailsText: 'Video details saved as draft (2 min ago)',
    tooltipText:
      'Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft.',
    fee: 1,
    isActive: true,
  },
} as Meta

const Template: Story<ActionBarProps> = (args) => <ActionBar {...args} />

export const New = Template.bind({})
export const NewWithDraftBadge = Template.bind({})
NewWithDraftBadge.args = {
  variant: 'new',
  draftBadge: {
    text: 'Saving drafts',
    tooltip: {
      text: 'Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft.',
    },
  },
}
export const Edit = Template.bind({})
Edit.args = {
  variant: 'edit',
  secondaryButton: {
    visible: true,
    text: 'Cancel',
  },
}
export const NFT = Template.bind({})
NFT.args = {
  variant: 'nft',
  primaryButton: {
    text: 'Next',
  },
  secondaryButton: {
    visible: true,
    text: 'Back',
  },
  draftBadge: {
    text: 'Saving drafts',
    tooltip: {
      text: 'Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft.',
    },
  },
}
