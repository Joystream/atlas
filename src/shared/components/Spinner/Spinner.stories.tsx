import Spinner, { SpinnerProps } from './Spinner'
import React from 'react'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Shared/Spinner',
  component: Spinner,
  argTypes: {
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
    },
  },
} as Meta

const Template: Story<SpinnerProps> = (args) => <Spinner {...args} />

export const Default = Template.bind({})
