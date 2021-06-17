import { Meta, Story } from '@storybook/react'
import React from 'react'

import { PersonalDataProvider, usePersonalData } from '@/hooks'

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
  },
  decorators: [
    (Story) => (
      <PersonalDataProvider>
        <Story />
      </PersonalDataProvider>
    ),
  ],
} as Meta

const Template: Story<DismissibleMessageProps> = (args) => {
  const { updateDismissedMessages } = usePersonalData()
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
