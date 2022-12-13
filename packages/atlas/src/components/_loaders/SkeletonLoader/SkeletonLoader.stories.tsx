import { Meta, StoryFn } from '@storybook/react'

import { SkeletonLoader, SkeletonLoaderProps } from './SkeletonLoader'

export default {
  title: 'loaders/SkeletonLoader',
  component: SkeletonLoader,
  argTypes: {
    width: {
      control: {
        type: 'range',
        min: 200,
        max: 500,
      },
    },
    height: {
      control: {
        type: 'range',
        min: 200,
        max: 500,
      },
    },
  },
  args: {
    width: 500,
    height: 200,
  },
} as Meta<SkeletonLoaderProps>

const Template: StoryFn<SkeletonLoaderProps> = (args) => <SkeletonLoader {...args} />

export const Default = Template.bind({})
