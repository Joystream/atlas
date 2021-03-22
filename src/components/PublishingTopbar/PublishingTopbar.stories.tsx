import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import PublishingTopbar from './PublishingTopbar'
import { Story, Meta } from '@storybook/react'

export default {
  title: 'General/PublishingTopbar',
  component: PublishingTopbar,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} as Meta

const RegularTemplate: Story = () => {
  return <PublishingTopbar />
}

export const Regular = RegularTemplate.bind({})
