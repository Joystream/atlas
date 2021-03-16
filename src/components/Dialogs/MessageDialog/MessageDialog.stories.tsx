import React from 'react'
import MessageDialog, { MessageDialogProps } from './MessageDialog'
import { Story, Meta } from '@storybook/react'
import { OverlayManagerProvider } from '@/hooks/useOverlayManager'

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
    additionalActionsNode: { table: { disable: true } },
    warning: { defaultValue: false },
    error: { defaultValue: false },
    icon: { control: { type: 'select', options: ['success', 'error', 'warning', 'info'] } },
    spinner: { defaultValue: false },
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
