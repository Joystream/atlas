import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { CheckboxGroup, CheckboxGroupProps } from './CheckboxGroup'

export default {
  title: 'inputs/CheckboxGroup',
  component: CheckboxGroup,
  argTypes: {
    className: { table: { disable: true } },
    selectedValue: { table: { disable: true } },
    options: { table: { disable: true } },
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
    name: { table: { disable: true } },
  },
  args: {
    label: 'Hello there',
    helperText: 't100',
    disabled: false,
    error: false,
  },
} as Meta<CheckboxGroupProps>

const Template: Story = (args) => {
  const [selected, setSelected] = useState<number[]>([])
  const handleChange: (id: number, e?: React.ChangeEvent<HTMLInputElement>) => void = (id) => {
    setSelected((prevState) => {
      if (selected.includes(id)) {
        return prevState.filter((state) => state !== id)
      }
      return [...prevState, id]
    })
  }

  const ITEMS = [
    {
      label: args.label,
      helperText: args.helperText,
    },
    {
      label: args.label,
      helperText: args.helperText,
    },
    {
      label: args.label,
      helperText: args.helperText,
    },
  ]

  return <CheckboxGroup {...args} name="radio-group" options={ITEMS} onChange={handleChange} value={selected} />
}

export const Default = Template.bind({})
