import { Meta, Story } from '@storybook/react'
import React from 'react'

import ToggleButton, { ToggleButtonProps } from './ToggleButton'

export default {
  title: 'Shared/T/ToggleButton',
  component: ToggleButton,
  argTypes: {
    onClick: {
      table: { disable: true },
    },
    containerCss: {
      table: { disable: true },
    },
    className: {
      table: { disable: true },
    },
  },
} as Meta

const Template: Story<ToggleButtonProps> = (args) => (
  <>
    <ToggleButton {...args} size="large" />
    <ToggleButton {...args} size="medium" />
    <ToggleButton {...args} size="small" />
  </>
)

export const Regular = Template.bind({})
Regular.args = {
  children: 'Button label',
}

export const WithIcon = Template.bind({})
WithIcon.args = {
  children: 'Icon label',
  icon: 'bars',
}
