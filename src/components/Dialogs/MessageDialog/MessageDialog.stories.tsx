import { Meta, Story } from '@storybook/react'
import React from 'react'

import { OverlayManagerProvider } from '@/hooks/useOverlayManager'

import { MessageDialog, MessageDialogProps } from './MessageDialog'

export default {
  title: 'General/MessageDialog',
  component: MessageDialog,
  args: {
    showAdditionalAction: false,
  },
  argTypes: {
    title: { defaultValue: 'There is an information of the utmost importance!' },
    description: { defaultValue: 'que me traten como dama. Aunque de eso se me olvide cuando estamos en la cama.' },
    exitButton: { defaultValue: true },
    primaryButtonText: { defaultValue: 'Confirm' },
    secondaryButtonText: { defaultValue: 'Cancel' },
    showDialog: { table: { disable: true } },
    warning: { defaultValue: false },
    error: { defaultValue: false },
    variant: { control: { type: 'select', options: ['info', 'success', 'warning', 'error'] } },
  },
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const RegularTemplate: Story<MessageDialogProps> = ({ ...args }) => {
  return <MessageDialog {...args} showDialog={true} />
}
export const Regular = RegularTemplate.bind({})
