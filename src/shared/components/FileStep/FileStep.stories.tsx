import { Meta, Story } from '@storybook/react'
import React from 'react'

import { FileStep, FileStepProps } from './FileStep'

export default {
  title: 'Shared/F/FileStep',
  component: FileStep,
  argTypes: {
    step: {
      defaultValue: 'video',
    },
    overhead: {
      defaultValue: 'Video File',
    },
    subtitle: {
      defaultValue: 'Select Video File',
    },
  },
} as Meta

const Template: Story<FileStepProps> = (args) => {
  return <FileStep {...args} />
}

export const Default = Template.bind({})
