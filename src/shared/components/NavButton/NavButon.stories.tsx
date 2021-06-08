import { Meta, Story } from '@storybook/react'
import React from 'react'

import NavButton, { NavButtonProps } from './NavButton'

export default {
  title: 'Shared/N/NavButton',
  component: NavButton,
  argTypes: {
    outerCss: {
      table: { disable: true },
    },
    onClick: {
      table: { disable: true },
    },
    direction: {
      table: { disable: true },
    },
  },
} as Meta

const Template: Story<NavButtonProps> = (args) => (
  <div>
    <NavButton {...args} direction="left" />
    <NavButton {...args} direction="right" />
  </div>
)
export const Regular = Template.bind({})
