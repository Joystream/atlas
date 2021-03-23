import React from 'react'
import TransactionDialog from './TransactionDialog'
import { ActionDialogProps } from '../ActionDialog/ActionDialog'
import { Story, Meta } from '@storybook/react'
import { OverlayManagerProvider } from '@/hooks/useOverlayManager'

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
  return <TransactionDialog {...args} showDialog={true} />
}
export const Regular = RegularTemplate.bind({})
