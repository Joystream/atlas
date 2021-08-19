import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Stepper, StepperProps } from './Stepper'

export default {
  title: 'Shared/S/Stepper',
  component: Stepper,
  args: {
    number: 1,
    title: 'Step title',
    thumbnailUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/cover-video/thumbnail.jpg',
  },
} as Meta

const Template: Story<StepperProps> = (args) => <Stepper {...args} />

export const Default = Template.bind({})

export const File = Template.bind({})
File.args = {
  variant: 'file',
}
