import React from 'react'
import TransactionDialog, { TransactionDialogProps } from './TransactionDialog'
import { Story, Meta } from '@storybook/react'
import { OverlayManagerProvider } from '@/hooks/useOverlayManager'

export default {
  title: 'General/TransactionDialog',
  component: TransactionDialog,
  argTypes: {
    title: { defaultValue: 'Waiting for funds...' },
    description: {
      defaultValue:
        'Sign the transaction using external signer app. It usually takes several seconds to from signing the transaction with external signer app long text.',
    },
    secondaryButtonText: { defaultValue: 'Cancel' },
    showDialog: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const RegularTemplate: Story<TransactionDialogProps> = ({ ...args }) => {
  return <TransactionDialog {...args} showDialog={true} />
}
export const Regular = RegularTemplate.bind({})
