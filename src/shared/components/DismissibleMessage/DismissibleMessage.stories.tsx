import { Meta, Story } from '@storybook/react'
import React from 'react'

import { usePersonalDataStore } from '@/providers'

import { DismissibleMessage, DismissibleMessageProps } from './DismissibleMessage'

import { Button } from '../Button'

export default {
  title: 'Shared/D/DismissibleMessage',
  component: DismissibleMessage,
  argTypes: {
    id: {
      defaultValue: 'video-drafts',
    },
    title: {
      defaultValue: 'Video Drafts are saved locally',
    },
    description: {
      defaultValue:
        'This mean you can only access one on the device you used to create it. Clearing your browser history will delete all your drafts.',
    },
    variant: {
      control: { type: 'select', options: ['primary', 'secondary', 'tertiary'] },
      defaultValue: 'primary',
    },
    actionText: { defaultValue: 'Action' },
    icon: {
      control: { type: 'select', options: [null, 'error', 'success', 'info', 'warning'] },
      defaultValue: null,
    },
  },
  decorators: [(Story) => <Story />],
} as Meta

const Template: Story<DismissibleMessageProps> = (args) => {
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)
  return (
    <>
      <DismissibleMessage {...args} />
      <Button
        onClick={() => {
          updateDismissedMessages(args.id, false)
        }}
      >
        Reset
      </Button>
    </>
  )
}

export const Default = Template.bind({})
