import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Spinner, SpinnerProps } from './Spinner'

export default {
  title: 'Shared/S/Spinner',
  component: Spinner,
  argTypes: {
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
    },
  },
} as Meta

const Template: Story<SpinnerProps> = (args) => <Spinner {...args} />

export const Default = Template.bind({})
