import { Meta, Story } from '@storybook/react'

import { SkeletonLoader, SkeletonLoaderProps } from './SkeletonLoader'

export default {
  title: 'loaders/SkeletonLoader',
  component: SkeletonLoader,
  argTypes: {
    width: {
      defaultValue: 500,
      control: {
        type: 'range',
        min: 200,
        max: 500,
      },
    },
    height: {
      defaultValue: 200,
      control: {
        type: 'range',
        min: 200,
        max: 500,
      },
    },
  },
} as Meta

const Template: Story<SkeletonLoaderProps> = (args) => <SkeletonLoader {...args} />

export const Default = Template.bind({})
