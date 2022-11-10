import { Meta, Story } from '@storybook/react'
import BN from 'bn.js'

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
      text: 'Lorem ipsum',
      tooltip: {
        text: 'Lorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum',
      },
    },
    fee: 100,
  } as Omit<ActionBarProps, 'fee'>,
  argTypes: {
    onClick: { table: { disable: true } },
    className: { table: { disable: true } },
  },
} as Meta<ActionBarProps>

const Template: Story<ActionBarProps> = (args) => <ActionBar {...args} fee={new BN(10000000000)} />

export const Default = Template.bind({})
