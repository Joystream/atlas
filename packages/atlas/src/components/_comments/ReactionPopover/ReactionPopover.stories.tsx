import { Meta, Story } from '@storybook/react'
import React from 'react'

import { ReactionPopover } from './ReactionPopover'

export default {
  title: 'comments/ReactionPopover',
  component: ReactionPopover,
  args: {
    active: true,
    reaction: 'love',
    state: 'default',
  },
} as Meta

const Template: Story = (args) => (
  <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <ReactionPopover {...args} />
  </div>
)

export const Default = Template.bind({})
