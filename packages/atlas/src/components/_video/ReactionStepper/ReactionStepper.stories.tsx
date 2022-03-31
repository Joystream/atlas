import { Meta, Story } from '@storybook/react'
import React from 'react'

import { ReactionStepper, ReactionStepperProps } from './ReactionStepper'

export default {
  title: 'video/ReactionStepper',
  component: ReactionStepper,
  args: {
    likes: 0,
    dislikes: 0,
    state: 'default',
  },
} as Meta<ReactionStepperProps>

const Template: Story<ReactionStepperProps> = (args) => <ReactionStepper {...args} />

export const Default = Template.bind({})
