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

const Template: Story<ReactionStepperProps> = (args) => {
  return (
    <>
      <ReactionStepper {...args} />
      <div style={{ width: '100%', height: '1px', background: '#272D33' }} />
      <p>(Divider is not a part of the component, it's only for presentional purposes)</p>
    </>
  )
}

export const Default = Template.bind({})
