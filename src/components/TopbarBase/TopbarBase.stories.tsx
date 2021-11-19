import { Meta, Story } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { TopbarBase, TopbarBaseProps } from './TopbarBase'

export default {
  title: 'navigation/TopbarBase',
  component: TopbarBase,
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['default', 'studio'],
      },
    },
    logoLinkUrl: {
      type: 'string',
      defaultValue: 'http://localhost:6006',
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
  return <TopbarBase {...args} fullLogoNode={<>logo</>} />
}

export const Regular = RegularTemplate.bind({})
