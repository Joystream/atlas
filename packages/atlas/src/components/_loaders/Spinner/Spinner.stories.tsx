import { Meta, StoryFn } from '@storybook/react'

import { Spinner, SpinnerProps } from './Spinner'

export default {
  title: 'loaders/Spinner',
  component: Spinner,
} as Meta<SpinnerProps>

const Template: StoryFn<SpinnerProps> = (args) => <Spinner {...args} />

export const Default = Template.bind({})
