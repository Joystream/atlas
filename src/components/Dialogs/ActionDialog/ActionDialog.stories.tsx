import React, { useState } from 'react'
import Dialog, { DialogProps } from './ActionDialog'
import { Story, Meta } from '@storybook/react'
import { OverlayManagerProvider } from '@/hooks/useOverlayManager'

export default {
  title: 'Shared/Dialog',
  component: Dialog,
  argTypes: {
    icon: {
      control: {
        type: 'select',
        options: ['success', 'failure', null],
      },
      defaultValue: 'success',
    },
    title: { control: 'text', defaultValue: 'Lorem ipsum dolor sit amet' },
    content: {
      control: 'text',
      defaultValue:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    primaryButton: { control: 'text', defaultValue: 'Confirm' },
    secondaryButton: { control: 'text', defaultValue: 'Cancel' },
  },
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const RegularTemplate: Story<DialogProps> = ({ icon, title, content, primaryButton, secondaryButton }) => {
  return (
    <Dialog
      title={title}
      content={content}
      primaryButton={primaryButton}
      secondaryButton={secondaryButton}
      icon={icon}
    />
  )
}

export const Regular = RegularTemplate.bind({})
