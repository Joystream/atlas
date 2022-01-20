import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Step, StepProps } from './Step'

export default {
  title: 'Other/Step',
  component: Step,
  args: {
    number: 1,
    title: 'Step title',
    stepType: 'current',
  },
  argTypes: {
    stepType: { type: 'select', options: ['current', 'future', 'completed'] },
  },
} as Meta

const Template: Story<StepProps> = (args) => <Step {...args} />

export const Default = Template.bind({})

export const File = Template.bind({})
File.args = {
  variant: 'file',
}
