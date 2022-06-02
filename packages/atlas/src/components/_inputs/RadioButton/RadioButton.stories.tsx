import { Meta, Story } from '@storybook/react'
import React from 'react'

import { RadioButton, RadioButtonProps } from './RadioButton'

export default {
  title: 'inputs/RadioButton',
  component: RadioButton,
  argTypes: {
    className: { table: { disable: true } },
    selectedValue: { table: { disable: true } },
    selected: { controls: { type: 'boolean' } },
  },
  args: {
    label: 'Hello there',
    helperText: 't100',
    disabled: false,
    error: false,
    selected: false,
  },
} as Meta<RadioButtonProps>

const Template: Story = (args) => {
  return <RadioButton {...args} name="radio-group" value="1" selectedValue={args.selected ? '1' : undefined} />
}

export const Default = Template.bind({})
