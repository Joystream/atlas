import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { RadioButtonGroup, RadioButtonGroupProps } from './RadioButtonGroup'

export default {
  title: 'inputs/RadioButtonGroup',
  component: RadioButtonGroup,
  argTypes: {
    className: { table: { disable: true } },
    selectedValue: { table: { disable: true } },
    options: { table: { disable: true } },
    onChange: { table: { disable: true } },
    value: { table: { disable: true } },
    name: { table: { disable: true } },
  },
  args: {
    label: 'Hello there',
    helperText: 't100',
    disabled: false,
    error: false,
  },
} as Meta<RadioButtonGroupProps>

const Template: Story = (args) => {
  const [selected, setSelected] = useState<string | number>('1')
  const handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    const element = e.currentTarget
    setSelected(element.value)
  }

  const ITEMS = [
    {
      label: args.label,
      helperText: args.helperText,
      value: '1',
    },
    {
      label: args.label,
      helperText: args.helperText,
      value: '2',
    },
    {
      label: args.label,
      helperText: args.helperText,
      value: '3',
    },
  ]

  return <RadioButtonGroup {...args} name="radio-group" options={ITEMS} onChange={handleChange} value={selected} />
}

export const Default = Template.bind({})
