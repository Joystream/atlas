import React from 'react'
import TransactionDialog from './TransactionDialog'
import { ActionDialogProps } from '../ActionDialog/ActionDialog'
import { Meta, Story } from '@storybook/react'
import { OverlayManagerProvider } from '@/hooks/useOverlayManager'
import { ExtrinsicStatus } from '@/joystream-lib'

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

const RegularTemplate: Story<ActionDialogProps> = ({ ...args }) => {
  return <TransactionDialog {...args} status={ExtrinsicStatus.Unsigned} />
}
export const Regular = RegularTemplate.bind({})
