import { Meta, Story } from '@storybook/react'

import { ActionBar, ActionBarProps } from './ActionBar'

export default {
  title: 'other/ActionBar',

  component: ActionBar,
  args: {
    primaryButton: {
      text: 'Create new channel',
    },
    secondaryButton: {
      text: 'Cancel',
    },
    infoBadge: {
      text: 'Saving drafts',
      tooltip: {
        text: 'Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft.',
      },
    },
    fee: 100,
  } as ActionBarProps,
  argTypes: {
    onClick: { table: { disable: true } },
    className: { table: { disable: true } },
  },
} as Meta<ActionBarProps>

const Template: Story<ActionBarProps> = (args) => <ActionBar {...args} />

export const Default = Template.bind({})
