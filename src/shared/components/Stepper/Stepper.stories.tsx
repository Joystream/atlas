import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Stepper, StepperProps } from './Stepper'

export default {
  title: 'Shared/S/Step',
  component: Stepper,
  args: {
    number: 1,
    title: 'Step title',
  },
} as Meta

const Template: Story<StepperProps> = (args) => <Stepper {...args} />

export const Default = Template.bind({})
