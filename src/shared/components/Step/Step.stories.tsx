import { Meta, Story } from '@storybook/react'
import React from 'react'

import { Step, StepProps } from './Step'

export default {
  title: 'Other/Step',
  component: Step,
  args: {
    number: 1,
    title: 'Step title',
    thumbnailUrl: 'https://eu-central-1.linodeobjects.com/atlas-assets/cover-video/thumbnail.jpg',
  },
} as Meta

const Template: Story<StepProps> = (args) => <Step {...args} />

export const Default = Template.bind({})

export const File = Template.bind({})
File.args = {
  variant: 'file',
}
