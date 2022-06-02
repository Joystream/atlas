import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'

import { RadioButtonGroup } from '@/components/_inputs/RadioButtonGroup'

import { RadioButton } from './RadioButton'

export default {
  title: 'inputs/RadioButton',
  component: RadioButton,
  argTypes: {
    className: { table: { disable: true } },
    selectedValue: { table: { disable: true } },
  },
  args: {
    label: 'Hello there',
    helperText: 't100',
    disabled: false,
    error: false,
  },
} as Meta

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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gridGap: '12px' }}>
      <RadioButtonGroup {...args} name="radio-group" options={ITEMS} onChange={handleChange} value={selected} />
    </div>
  )
}

export const Default = Template.bind({})
