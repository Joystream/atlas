import { Meta, Story } from '@storybook/react'
import React from 'react'
import FileDrop, { FileDropProps } from './FileDrop'

export default {
  title: 'Shared/FileDrop',
  component: FileDrop,
  argTypes: {
    step: {
      defaultValue: 'video',
    },
    icon: {
      defaultValue: 'video-dnd',
    },
    title: {
      defaultValue: 'Select Video File',
    },
    paragraph: {
      defaultValue: '16:9 Ratio preferred. 4K, 1440p, 1080p or 720p. This is example FPO data only.',
    },
  },
} as Meta

const Template: Story<FileDropProps> = (args) => {
  return <FileDrop {...args} />
}

export const Default = Template.bind({})
