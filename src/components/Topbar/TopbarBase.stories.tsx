import { Story, Meta } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { TopbarBaseProps, TopbarBase } from './TopbarBase'

export default {
  title: 'Shared/T/TopbarBase',
  component: TopbarBase,
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['default', 'studio'],
      },
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} as Meta

const RegularTemplate: Story<TopbarBaseProps> = (args) => {
  return <TopbarBase {...args} />
}

export const Regular = RegularTemplate.bind({})
