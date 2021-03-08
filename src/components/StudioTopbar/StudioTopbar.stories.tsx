import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import StudioTopbar from './StudioTopbar'
import { Story, Meta } from '@storybook/react'

export default {
  title: 'General/StudioTopbar',
  component: StudioTopbar,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} as Meta

const RegularTemplate: Story = () => {
  return <StudioTopbar />
}

export const Regular = RegularTemplate.bind({})
