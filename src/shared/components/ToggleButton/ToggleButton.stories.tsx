import React from 'react'
import ToggleButton, { ToggleButtonProps } from './ToggleButton'
import { Meta, Story } from '@storybook/react'

export default {
  title: 'Shared/ToggleButton',
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
    <ToggleButton {...args} size="regular" />
    <ToggleButton {...args} size="small" />
    <ToggleButton {...args} size="smaller" />
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
