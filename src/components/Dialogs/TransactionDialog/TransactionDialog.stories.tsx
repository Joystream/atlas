import { Meta, Story } from '@storybook/react'
import React from 'react'

import { ExtrinsicStatus } from '@/joystream-lib'
import { OverlayManagerProvider } from '@/providers/useOverlayManager'

import { TransactionDialog, TransactionDialogProps } from './TransactionDialog'

export default {
  title: 'General/TransactionDialog',
  component: TransactionDialog,
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const RegularTemplate: Story<TransactionDialogProps> = ({ ...args }) => {
  return <TransactionDialog {...args} status={ExtrinsicStatus.Unsigned} />
}
export const Regular = RegularTemplate.bind({})
