import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import TopbarBase, { TopbarBaseProps } from './TopbarBase'
import { Story, Meta } from '@storybook/react'

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
