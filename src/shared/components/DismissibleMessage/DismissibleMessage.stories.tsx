import { PersonalDataProvider } from '@/hooks'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import DismissibleMessage, { DismissibleMessageProps } from './DismissibleMessage'

export default {
  title: 'Shared/DismissibleMessage',
  component: DismissibleMessage,
  argTypes: {
    title: {
      defaultValue: 'Video Drafts are saved locally',
    },
    description: {
      defaultValue:
        'This mean you can only access one on the device you used to create it. Clearing your browser history will delete all your drafts.',
    },
  },
  decorators: [(story) => <PersonalDataProvider>{story()}</PersonalDataProvider>],
} as Meta

const Template: Story<DismissibleMessageProps> = (args) => <DismissibleMessage {...args} />

export const Default = Template.bind({})
